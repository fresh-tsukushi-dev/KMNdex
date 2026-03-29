// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

// orgs.ts manages front page org settings
import { action, Action } from "easy-peasy";
import { RK_SCOPED_ORGS } from "../config/rkmusic";

export interface Org {
  name: string;
  name_jp?: string;
  short: string;
}

export interface OrgModel {
  currentOrg: Org;
  setOrg: Action<OrgModel, Org>;

  orgsList: string[];
  setOrgsList: Action<OrgModel, string[]>;
}

const DEFAULT_ORGS = RK_SCOPED_ORGS.length > 0 ? RK_SCOPED_ORGS : ["RK Music"];

const orgModel: OrgModel = {
  currentOrg: { name: DEFAULT_ORGS[0], name_jp: DEFAULT_ORGS[0], short: "" },

  setOrg: action((state, target) => {
    state.currentOrg = target;
  }),

  orgsList: [...DEFAULT_ORGS],
  setOrgsList: action((state, order) => {
    state.orgsList = order;
  }),
};

export default orgModel;
