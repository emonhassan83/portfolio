import { Schema, model } from 'mongoose';
import { TProject } from './project.interface';

const projectSchema = new Schema<TProject>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: String, required: true },
    technologies: { type: String, required: true },
    duration: { type: String, required: true },
    live_site_url: { type: String, required: true },
    client_site_url: { type: String, required: true },
    server_site_url: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Project = model<TProject>('Project', projectSchema);
