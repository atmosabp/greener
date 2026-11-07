
import type { ServiceTypes } from "../../types/services-types";

//Minhas alterações
export interface UpdatedService {
  id: string;
  previous: ServiceTypes;
  current: ServiceTypes;
  changedFields: string[];
}

export interface ServiceListChanges {
  added: ServiceTypes[];
  removed: ServiceTypes[];
  updated: UpdatedService[];
}

function normalizeLocation(location: ServiceTypes["location"]): string {
  if (!location) return "";

  return JSON.stringify({
    region_code: location.region_code ?? null,
    country: location.country ?? null,
    region: location.region ?? null,
    city: location.city ?? null,
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
  });
}

function findChangedFields(
  previous: ServiceTypes,
  current: ServiceTypes,
): string[] {
  const changedFields: string[] = [];

  if (previous.name !== current.name) {
    changedFields.push("name");
  }

  if (previous.metrics_path !== current.metrics_path) {
    changedFields.push("metrics_path");
  }

  if (
    normalizeLocation(previous.location) !==
    normalizeLocation(current.location)
  ) {
    changedFields.push("location");
  }

  return changedFields;
}

function createServiceMap(
  services: ServiceTypes[],
): Map<string, ServiceTypes> {
  const serviceMap = new Map<string, ServiceTypes>();

  for (const service of services) {
    if (!service.id) {
      throw new Error("Serviço encontrado sem ID.");
    }

    if (serviceMap.has(service.id)) {
      throw new Error(`ID de serviço duplicado: ${service.id}`);
    }

    serviceMap.set(service.id, service);
  }

  return serviceMap;
}

export function compareServiceLists(
  previousList: ServiceTypes[],
  currentList: ServiceTypes[],
): ServiceListChanges {
  const previousMap = createServiceMap(previousList);
  const currentMap = createServiceMap(currentList);

  const changes: ServiceListChanges = {
    added: [],
    removed: [],
    updated: [],
  };

  for (const [id, current] of currentMap) {
    const previous = previousMap.get(id);

    if (!previous) {
      changes.added.push(current);
      continue;
    }

    const changedFields = findChangedFields(previous, current);

    if (changedFields.length > 0) {
      changes.updated.push({
        id,
        previous,
        current,
        changedFields,
      });
    }
  }

  for (const [id, previous] of previousMap) {
    if (!currentMap.has(id)) {
      changes.removed.push(previous);
    }
  }

  return changes;
}
