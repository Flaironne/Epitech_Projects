export type User = {
  id: string;
  aaId: string;
  activityBlocked: boolean;
  avatarHash: string;
  avatarUrl: string;
  bio: string;
  bioData: {
    emoji: {};
  };
  confirmed: boolean;
  fullName: string;
  idEnterprise: string | null;
  idEnterprisesDeactivated: string[];
  idMemberReferrer: string;
  idPremOrgsAdmin: string[];
  initials: string;
  memberType: string;
  nonPublic: {};
  nonPublicAvailable: boolean;
  products: any[]; // You can replace 'any[]' with a specific type if needed
  url: string;
  username: string;
  status: string;
  aaBlockSyncUntil: string | null;
  aaEmail: string | null;
  aaEnrolledDate: string | null;
  avatarSource: string;
  credentialsRemovedCount: number;
  dateLastImpression: string;
  domainClaimed: string | null;
  email: string;
  gravatarHash: string;
  idBoards: string[];
  idOrganizations: string[];
  idEnterprisesAdmin: string[];
  limits: {
    boards: {
      totalPerMember: {
        status: string;
        disableAt: number;
        warnAt: number;
      };
    };
    orgs: {
      totalPerMember: {
        status: string;
        disableAt: number;
        warnAt: number;
      };
    };
  };
  loginTypes: string[];
  marketingOptIn: {
    optedIn: boolean;
    date: string;
  };
  messagesDismissed: string[];
  nodeId: string;
  oneTimeMessagesDismissed: string[];
  sessionType: string | null;
  prefs: {
    sendSummaries: boolean;
    minutesBetweenSummaries: number;
    minutesBeforeDeadlineToNotify: number;
    colorBlind: boolean;
    locale: string;
    privacy: {
      fullName: string;
      avatar: string;
    };
  };
  trophies: any[]; // You can replace 'any[]' with a specific type if needed
  uploadedAvatarHash: string | null;
  uploadedAvatarUrl: string | null;
  premiumFeatures: any[]; // You can replace 'any[]' with a specific type if needed
  isAaMastered: boolean;
  ixUpdate: string;
};

export type Workspace = {
  id: string;
  creationMethod: null;
  name: string;
  credits: any[];
  displayName: string;
  desc: string;
  descData: {
    emoji: {};
  };
  domainName: null;
  idBoards: string[];
  idEnterprise: null;
  idMemberCreator: null;
  invited: boolean;
  invitations: any[];
  limits: {
    orgs: {
      totalMembersPerOrg: {
        status: string;
        disableAt: number;
        warnAt: number;
      };
      freeBoardsPerOrg: {
        status: string;
        disableAt: number;
        warnAt: number;
      };
      usersPerFreeOrg: {
        status: string;
        disableAt: number;
        warnAt: number;
        count: number;
      };
    };
  };
  membersCount: number;
  nodeId: string;
  prefs: {
    permissionLevel: string;
    orgInviteRestrict: any[];
    boardInviteRestrict: string;
    externalMembersDisabled: boolean;
    associatedDomain: null;
    googleAppsVersion: number;
    boardVisibilityRestrict: {
      private: string;
      org: string;
      enterprise: string;
      public: string;
    };
    boardDeleteRestrict: {
      private: string;
      org: string;
      enterprise: string;
      public: string;
    };
    attachmentRestrictions: null;
    newLicenseInviteRestrict: null;
    newLicenseInviteRestrictUrl: null;
    atlassianIntelligenceEnabled: boolean;
  };
  powerUps: any[];
  offering: string;
  products: any[];
  billableMemberCount: number;
  billableCollaboratorCount: number;
  url: string;
  website: null;
  logoHash: null;
  logoUrl: null;
  premiumFeatures: string[];
  promotions: any[];
  enterpriseJoinRequest: {
    [key: string]: any;
  };
  standardVariation: null;
  availableLicenseCount: null;
  maximumLicenseCount: null;
  ixUpdate: string;
  teamType: string;
  dateLastActivity: string | null;
  jwmLink: null;
  activeMembershipCount: null;
  idActiveAdmins: null;
  memberships: {
    idMember: string;
    memberType: string;
    unconfirmed: boolean;
    deactivated: boolean;
    id: string;
  }[];
};

export type Board = {
  id: string;
  name: string;
  desc: string;
  descData: any; // You can replace 'any' with a specific type if needed
  closed: boolean;
  idOrganization: string;
  idEnterprise: string | null;
  pinned: boolean;
  url: string;
  shortUrl: string;
  prefs: {
    permissionLevel: string;
    hideVotes: boolean;
    voting: string;
    comments: string;
    invitations: string;
    selfJoin: boolean;
    cardCovers: boolean;
    cardCounts: boolean;
    isTemplate: boolean;
    cardAging: string;
    calendarFeedEnabled: boolean;
    hiddenPluginBoardButtons: any[]; // You can replace 'any[]' with a specific type if needed
    switcherViews: {
      viewType: string;
      enabled: boolean;
    }[];
    background: string;
    backgroundColor: string;
    backgroundImage: string;
    backgroundTile: boolean;
    backgroundBrightness: string;
    backgroundImageScaled: {
      width: number;
      height: number;
      url: string;
    }[];
    backgroundBottomColor: string;
    backgroundTopColor: string;
    canBePublic: boolean;
    canBeEnterprise: boolean;
    canBeOrg: boolean;
    canBePrivate: boolean;
    canInvite: boolean;
  };
  labelNames: {
    [color: string]: string;
  };
};

export type List = {
  id: string;
  name: string;
  closed: boolean;
  color: string | null;
  idBoard: string;
  pos: number;
  subscribed: boolean;
  softLimit: any;
};

export type Card = {
  id: string;
  badges: {
    attachmentsByType: {
      trello: {
        board: number;
        card: number;
      };
    };
    location: boolean;
    votes: number;
    viewingMemberVoted: boolean;
    subscribed: boolean;
    fogbugz: string;
    checkItems: number;
    checkItemsChecked: number;
    checkItemsEarliestDue: string | null;
    comments: number;
    attachments: number;
    description: boolean;
    due: string | null;
    dueComplete: boolean;
    start: string | null;
  };
  checkItemStates: any[];
  closed: boolean;
  dueComplete: boolean;
  dateLastActivity: string;
  desc: string;
  descData: {
    emoji: any;
  };
  due: string | null;
  dueReminder: any;
  email: string | null;
  idBoard: string;
  idChecklists: string[];
  idList: string;
  idMembers: string[];
  idMembersVoted: string[];
  idShort: number;
  idAttachmentCover: string | null;
  labels: any[];
  idLabels: string[];
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start: string | null;
  subscribed: boolean;
  url: string;
  cover: {
    idAttachment: string | null;
    color: string | null;
    idUploadedBackground: string | null;
    size: string;
    brightness: string;
    idPlugin: string | null;
  };
  isTemplate: boolean;
  cardRole: string | null;
};

export type Organization = {
  id: string;
  name: string;
};

export type Member = {
  id: string;
  activityBlocked: boolean;
  avatarHash: string;
  avatarUrl: string;
  fullName: string;
  idMemberReferrer: string | null;
  initials: string;
  nonPublic: any; // Adjust the type as needed
  nonPublicAvailable: boolean;
  username: string;
};

export type Notification = {
  id: string;
  unread: boolean;
  type: string;
  date: string;
  dateRead: string;
  data: {
    organization: Organization;
    idMember: string;
    memberType: string;
  };
  appCreator: any; // Adjust the type as needed
  idMemberCreator: string;
  idAction: string;
  reactions: any[]; // Adjust the type as needed
  isReactable: boolean;
  memberCreator: Member;
};

export type BatchResponse<T> = {
  "200": T;
};
