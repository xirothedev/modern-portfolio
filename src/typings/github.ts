import { RestEndpointMethodTypes } from "@octokit/rest";

export type Repository = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];
export interface MultipleRepositoriesResponse extends Map<string, Repository | null> {}
