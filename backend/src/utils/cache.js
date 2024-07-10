import {
  fetchAllRepository,
  fetchCommitsById,
  fetchBranchesById,
  fetchContributorsById,
  fetchMembersById,
  fetchAllTreeById,
  fetchRepositoriesUpdatedAfter,
  fetchRepositoryById,
} from '../services/appServices.js';
import { config } from './config.js';

/**
 * Array of caches.
 * Each cache object contains a name, cache instance, and fetch function.
 * @typedef {Object} CacheObject
 * @property {string} name - The name of the cache.
 * @property {Map} cache - The cache instance.
 * @property {Function} fetchFn - The fetch function associated with the cache.
 */
const caches = [
  { name: 'cacheCommitsById', cache: new Map(), fetchFn: fetchCommitsById },
  { name: 'cacheBranchesById', cache: new Map(), fetchFn: fetchBranchesById },
  {
    name: 'cacheContributorsById',
    cache: new Map(),
    fetchFn: fetchContributorsById,
  },
  { name: 'cacheMembersById', cache: new Map(), fetchFn: fetchMembersById },
  { name: 'cacheTreesById', cache: new Map(), fetchFn: fetchAllTreeById },
  { name: 'cacheProjectsById', cache: new Map(), fetchFn: fetchRepositoryById },
];

/**
 * Dictionary object that stores caches.
 * @type {Object.<string, CacheObject>}
 */
const cacheDict = caches.reduce((acc, cacheObj) => {
  acc[cacheObj.name] = cacheObj;
  return acc;
}, {});

/**
 * Represents the last update time.
 * @type {Date}
 */
let lastUpdateTime = new Date();
/**
 * The interval in milliseconds for updating the cache.
 * @type {number}
 */
const interval = config.CACHE_UPDATE_INTERVAL * 60 * 1000;
/**
 * Updates all caches by project ID.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<void>} - A promise that resolves when all caches are updated.
 */
export const updateAllCachesById = async (projectId) => {
  try {
    const results = await Promise.allSettled(
      caches.map(({ fetchFn }) =>
        fetchFn === fetchRepositoryById
          ? fetchFn(projectId, config.access_token).then((result) => [result])
          : fetchFn(projectId, config.access_token)
      )
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        caches[index].cache.set(projectId, result.value);
      } else {
        console.warn(
          `Failed to fetch data for cache: ${caches[index].name}`,
          result.reason
        );
      }
    });
  } catch (error) {
    console.error(
      `Failed to update caches for project ID ${projectId}:`,
      error
    );
  }
};

/**
 * Removes a project from caches based on its ID.
 * @param {string} projectId - The ID of the project to be removed from caches.
 * @returns {Promise<void>} - A promise that resolves when the project is removed from caches.
 */
export const removeProjectFromCaches = async (projectId) => {
  try {
    caches.forEach(({ cache }) => {
      if (cache.has(String(projectId))) {
        cache.delete(String(projectId));
      }
    });
  } catch (error) {
    //TODO: Add error handling
    console.error(
      `Failed to remove project ID: ${projectId} from caches: ${error}`
    );
  }
};

/**
 * Retrieves information from the cache based on the provided id.
 * @param {string} id - The id of the cache object to retrieve information from.
 * @param {object} cacheObject - The cache object containing the cache name and data.
 * @returns {object} - An object containing the cache name, projectId, and data retrieved from the cache.
 */
const getInfoFromCache = (id, cacheObjectCache) => {
  return {
    cacheName: cacheObjectCache.name,
    projectId: id,
    data: cacheObjectCache.get(id.trim()) || null,
  };
};

/**
 * Retrieves all information from the cache object.
 * @param {Object} cacheObject - The cache object containing the data.
 * @returns {Array} - An array of objects containing the cache name, project ID, and data.
 */
const getAllInfoFromCache = (cacheObject) => {
  const allData = [];

  for (const [id, value] of cacheObject.cache.entries()) {
    allData.push({
      cacheName: cacheObject.name,
      projectId: id,
      data: value,
    });
  }

  return allData;
};

/**
 * Retrieves information from caches based on provided IDs and cache names.
 * @param {string[]} cacheNames - List of cache names to retrieve information from. Cannot be empty.
 * @param {string[]} ids - List of IDs to retrieve information for. Can be empty.
 * @returns {object[]} - List of all retrieved data.
 */
export const getInfoFromCaches = (cacheNames, ids) => {
  if (cacheNames.length === 0) {
    throw new Error('Cache names list cannot be empty');
  }
  const data = [];
  const isEmptyIds = ids.length === 0 || (ids.length === 1 && ids[0] === '');

  if (isEmptyIds) {
    cacheNames.forEach((cacheName) => {
      const cacheObject = cacheDict[cacheName];

      if (cacheObject) {
        data.push(...getAllInfoFromCache(cacheObject));
      }
    });
  } else {
    ids.forEach((id) => {
      cacheNames.forEach((cacheName) => {
        const cacheObject = cacheDict[cacheName];

        if (cacheObject) {
          const cacheData = getInfoFromCache(id, cacheObject.cache);
          data.push(cacheData);
        }
      });
    });
  }

  return data;
};
/**
 * Checks if an update is needed based on the last update time and interval.
 * @returns {boolean} Returns true if an update is needed, false otherwise.
 */
export const updateNeeded = () => {
  const currentTime = new Date();
  return currentTime - lastUpdateTime >= interval;
};

/**
 * Checks and updates caches if the specified interval has passed since the last update.
 * @returns {Promise<void>} A promise that resolves when the caches have been checked and updated.
 */
export const updateCachesByTime = async () => {
  if (updateNeeded) {
    try {
      const updatedRepositories = await fetchRepositoriesUpdatedAfter(
        lastUpdateTime.toISOString(),
        config.access_token
      );
      // console.log('Updated repositories:', updatedRepositories);
      if (updatedRepositories.length === 0) {
        lastUpdateTime = new Date();
        return;
      }
      const results = await Promise.allSettled(
        updatedRepositories.map(async (repository) => {
          await updateAllCachesById(repository.id);
        })
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(
            `Failed to update cache for repository: ${updatedRepositories[index].id}`,
            result.reason
          );
        }
      });

      lastUpdateTime = new Date().toISOString();
    } catch (error) {
      console.error(`Failed to fetch and update repositories:`, error);
    }
  }
};

/**
 * Initializes the cache for the given fetch function and cache map.
 * Fetches data for each project in the cache and stores it in the cache map.
 *
 * @param {Function} fetchFunction - The function used to fetch data for a project.
 * @param {Map} cacheMap - The map used to store the fetched data.
 * @returns {Promise<void>} - A promise that resolves when all data fetching is complete.
 */
const initializeCacheFor = async (fetchFunction, cacheMap) => {
  const projects = Array.from(cacheDict['cacheProjectsById'].cache.values());

  const results = await Promise.allSettled(
    projects.map(async (project) => {
      try {
        const data = await fetchFunction(project[0].id, config.access_token);
        cacheMap.set(String(project[0].id), data || []);
        return { success: true };
      } catch (error) {
        console.error(
          `Error fetching data for project ${project.id}: ${error}`
        );
        return { projectId: project[0].id, error: true };
      }
    })
  );

  results.forEach((result) => {
    if (result.status === 'rejected' || result.value?.error) {
      //TODO: Add error handling
    }
  });
};

/**
 * Initializes the project cache by fetching all repositories and storing them in the cache.
 * @returns {Promise<void>} A promise that resolves when the cache has been successfully initialized.
 * @throws {Error} If there is a critical failure in loading projects.
 */
const initializeCacheProject = async () => {
  try {
    const projects = await fetchAllRepository(config.access_token);
    projects.body.forEach((project) => {
      cacheDict['cacheProjectsById'].cache.set(String(project.id), [project]);
    });
    console.log('Main project cache has been successfully initialized.');
  } catch (error) {
    console.error('Critical failure in loading projects:', error);
    throw new Error('Initialization of project cache failed');
  }
};

/**
 * Initializes all caches.
 * @returns {Promise<void>} A promise that resolves when all caches have been initialized successfully.
 */
export const initializeAllCaches = async () => {
  await initializeCacheProject(); // Ensure this completes successfully

  const cacheInitializations = [
    'cacheCommitsById',
    'cacheBranchesById',
    'cacheContributorsById',
    'cacheMembersById',
    'cacheTreesById',
  ];

  for (const cacheName of cacheInitializations) {
    const cacheObj = cacheDict[cacheName];
    if (cacheObj && cacheObj.cache) {
      await initializeCacheFor(cacheObj.fetchFn, cacheObj.cache);
    } else {
      console.warn(`Cache entry for ${cacheName} is undefined.`);
    }
  }
  console.log('All caches have been initialized successfully.');
};
