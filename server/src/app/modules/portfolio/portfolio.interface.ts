import { z } from 'zod';
import { PORTFOLIO_RESOURCES } from './portfolio.constant';
import { PortfolioValidation, resourceSchemas } from './portfolio.validation';

export type TPortfolioResource = (typeof PORTFOLIO_RESOURCES)[number];

export type TProfileContent = z.infer<typeof PortfolioValidation.profileBody>;

export type TResourceInput<R extends TPortfolioResource> = z.infer<(typeof resourceSchemas)[R]>;

export type TPortfolioImport = z.infer<typeof PortfolioValidation.importAll>['body'];
