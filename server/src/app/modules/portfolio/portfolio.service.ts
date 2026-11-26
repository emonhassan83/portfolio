import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import revalidateClient from '../../utils/revalidateClient';
import { PORTFOLIO_RESOURCES, PROFILE_KEY } from './portfolio.constant';
import {
  TPortfolioImport,
  TPortfolioResource,
  TProfileContent,
} from './portfolio.interface';
import { PortfolioProfile, resourceModels } from './portfolio.model';

const SORT = { order: 1, createdAt: 1 } as const;
const HIDDEN_FIELDS = '-createdAt -updatedAt -isPublished -__v';

/** Public payload for the home page: profile + published items, in order. */
const getPublicPortfolio = async () => {
  const [profile, ...collections] = await Promise.all([
    PortfolioProfile.findOne({ key: PROFILE_KEY }).select('-_id -key -createdAt -__v').lean(),
    ...PORTFOLIO_RESOURCES.map((r) =>
      resourceModels[r].find({ isPublished: true }).sort(SORT).select(HIDDEN_FIELDS).lean(),
    ),
  ]);

  const result: Record<string, unknown> = { profile: profile ?? null };
  PORTFOLIO_RESOURCES.forEach((r, i) => {
    result[r] = collections[i];
  });
  return result;
};

const getProfile = async () => {
  return PortfolioProfile.findOne({ key: PROFILE_KEY }).lean();
};

const updateProfile = async (payload: TProfileContent) => {
  const result = await PortfolioProfile.findOneAndUpdate(
    { key: PROFILE_KEY },
    { ...payload, key: PROFILE_KEY },
    { upsert: true, returnDocument: 'after', runValidators: true, overwrite: true },
  ).lean();
  await revalidateClient();
  return result;
};

const listResource = async (resource: TPortfolioResource) => {
  return resourceModels[resource].find().sort(SORT).lean();
};

const createResource = async (resource: TPortfolioResource, payload: Record<string, unknown>) => {
  const Model = resourceModels[resource];
  // New items go to the end unless an order was given.
  if (payload.order === undefined) {
    const last = await Model.findOne().sort({ order: -1 }).select('order').lean<{ order?: number }>();
    payload.order = (last?.order ?? -1) + 1;
  }
  const result = await Model.create(payload);
  await revalidateClient();
  return result;
};

const updateResource = async (
  resource: TPortfolioResource,
  id: string,
  payload: Record<string, unknown>,
) => {
  const result = await resourceModels[resource]
    .findByIdAndUpdate(id, payload, { returnDocument: 'after', runValidators: true })
    .lean();
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Item not found');
  await revalidateClient();
  return result;
};

const deleteResource = async (resource: TPortfolioResource, id: string) => {
  const result = await resourceModels[resource].findByIdAndDelete(id).lean();
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Item not found');
  await revalidateClient();
  return result;
};

/** Sets `order` to each id's position in the given list. */
const reorderResource = async (resource: TPortfolioResource, ids: string[]) => {
  const Model = resourceModels[resource];
  await Model.bulkWrite(
    ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    })),
  );
  await revalidateClient();
  return Model.find().sort(SORT).lean();
};

/** One-time seed from the static data file; refused once any content exists. */
const importAll = async (payload: TPortfolioImport) => {
  const counts = await Promise.all([
    PortfolioProfile.countDocuments(),
    ...PORTFOLIO_RESOURCES.map((r) => resourceModels[r].countDocuments()),
  ]);
  if (counts.some((c) => c > 0)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Content already exists. Import only works on an empty database.',
    );
  }

  await PortfolioProfile.create({ ...payload.profile, key: PROFILE_KEY });
  for (const r of PORTFOLIO_RESOURCES) {
    const items = payload[r].map((item, index) => ({ ...item, order: item.order ?? index }));
    if (items.length) await resourceModels[r].insertMany(items);
  }
  await revalidateClient();
  return getPublicPortfolio();
};

export const PortfolioServices = {
  getPublicPortfolio,
  getProfile,
  updateProfile,
  listResource,
  createResource,
  updateResource,
  deleteResource,
  reorderResource,
  importAll,
};
