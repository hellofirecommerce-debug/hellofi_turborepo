import { getServiceableCities } from "../../../../../lib/data/serviceablePincode.data";
import EditInventoryClient from "./EditInventoryClient";

export default async function Page() {
  const cities = await getServiceableCities();
  return <EditInventoryClient cities={cities} />;
}
