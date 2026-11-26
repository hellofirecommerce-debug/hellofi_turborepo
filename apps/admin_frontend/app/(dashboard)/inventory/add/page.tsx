import { getServiceableCities } from "../../../../lib/data/serviceablePincode.data";
import AddInventoryClient from "./AddInventoryClient";

export default async function Page() {
  const cities = await getServiceableCities();
  return <AddInventoryClient cities={cities} />;
}
