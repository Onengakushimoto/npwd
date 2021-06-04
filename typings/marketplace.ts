export interface MarketplaceListing extends MarketplaceListingBase {
  id: number;
  identifier?: string;
  username: string;
  name: string;
  number: string;
}

export interface MarketplaceListingBase {
  title: string;
  url: string;
  description: string;
}

export interface MarketplaceActionResp {
  err: boolean;
  errMsg?: string;
}

export enum MarketplaceEvents {
  ADD_LISTING = 'npwd:addListing',
  ADD_LISTING_SUCCESS = 'npwd:addListingSuccess',
  FETCH_LISTING = 'npwd:fetchAllListings',
  SEND_LISTING = 'npwd:sendAllListings',
  ACTION_RESULT = 'npwd:selloutActionResult',
  DELETE_LISTING = 'npwd:marketplaceDeleteListing',
  DELETE_LISTING_SUCCESS = 'npwd:marketplaceDeleteListingSuccess',
  REPORT_LISTING = 'npwd:reportListing',
  REPORT_LISTING_SUCCESS = 'npwd:reportListingSuccess',
  REPORT_LISTING_SUCESS = 'npwd:reportListingFailed',
  SEND_ALERT = 'nwpd:sendListingAlert',
  BROADCAST_EVENT = 'npwd:sendMarketplaceBroadcast',
}

export interface MarketplaceDeleteDTO {
  id: number;
}

export type MarketPlaceBroadcastData =
  | {
      type: 'ADD';
      listing: MarketplaceListing;
    }
  | {
      type: 'DELETE';
      listing: MarketplaceDeleteDTO;
    };
