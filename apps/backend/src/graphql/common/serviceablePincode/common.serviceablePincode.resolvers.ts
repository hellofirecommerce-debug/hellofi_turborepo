import CommonServiceablePincodeService from "../../../services/common/common.serviceablePincode.service";

export const resolvers = {
  Query: {
    getServiceableCities: async () =>
      CommonServiceablePincodeService.getAllCities(),
  },
};
