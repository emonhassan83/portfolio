"use client";

import { notFound, useParams } from "next/navigation";
import ResourceManager from "../../../../components/Dashboard/Portfolio/ResourceManager";
import { resources } from "../../../../components/Dashboard/Portfolio/schemas";

export default function Page() {
  const { resource } = useParams();
  if (!Object.hasOwn(resources, resource)) notFound();
  return <ResourceManager key={resource} resource={resource} />;
}
