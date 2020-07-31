/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProviderInfrastructure, ProviderLibrary } from '@boostercloud/framework-types'
import { requestFailed, requestSucceeded } from './library/api-adapter'
import { rawGraphQLRequestToEnvelope } from './library/graphql-adapter'
import {
  rawEventsToEnvelopes,
  storeEvents,
  readEntityEventsSince,
  readEntityLatestSnapshot,
} from './library/events-adapter'
import { CosmosClient } from '@azure/cosmos'
import { environmentVarNames } from './constants'
import { fetchReadModel, storeReadModel } from './library/read-model-adapter'
import { searchReadModel } from './library/searcher-adapter'

let cosmosClient: CosmosClient | undefined
if (process.env[environmentVarNames.cosmosDbConnectionString]) {
  // @ts-ignore
  cosmosClient = new CosmosClient(process.env[environmentVarNames.cosmosDbConnectionString])
} else {
  cosmosClient = undefined
}

export const Provider: ProviderLibrary = {
  // ProviderEventsLibrary
  events: {
    rawToEnvelopes: rawEventsToEnvelopes,
    store: storeEvents.bind(null, cosmosClient),
    forEntitySince: readEntityEventsSince.bind(null, cosmosClient),
    latestEntitySnapshot: readEntityLatestSnapshot.bind(null, cosmosClient),
  },
  // ProviderReadModelsLibrary
  readModels: {
    fetch: fetchReadModel.bind(null, cosmosClient),
    search: searchReadModel.bind(null, cosmosClient),
    subscribe: undefined as any,
    rawToEnvelopes: undefined as any,
    fetchSubscriptions: undefined as any,
    store: storeReadModel.bind(null, cosmosClient),
    deleteSubscription: undefined as any,
    deleteAllSubscriptions: undefined as any,
  },
  // ProviderGraphQLLibrary
  graphQL: {
    rawToEnvelope: rawGraphQLRequestToEnvelope,
    handleResult: requestSucceeded,
  },
  // ProviderAuthLibrary
  auth: {
    rawToEnvelope: undefined as any,
    fromAuthToken: undefined as any,
  },
  // ProviderAPIHandling
  api: {
    requestSucceeded,
    requestFailed,
  },
  connections: {
    storeData: notImplemented as any,
    fetchData: notImplemented as any,
    deleteData: notImplemented as any,
    sendMessage: notImplemented as any,
  },
  // ProviderInfrastructureGetter
  infrastructure: () =>
    require(require('../package.json').name + '-infrastructure').Infrastructure as ProviderInfrastructure,
}

function notImplemented(): void {}

export * from './constants'
