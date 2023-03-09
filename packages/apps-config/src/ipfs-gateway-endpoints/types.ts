// Copyright 2019-2021 Crust Network authors & contributors
// License: Apache-2.0

export interface AuthIpfsEndpoint {
  text?: string;
  value: string;
  location?: string;
  status?: string; // online, error, inactivated(incluede null and all other strings)
}
