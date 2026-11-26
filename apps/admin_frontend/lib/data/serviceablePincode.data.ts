import { GET_SERVICEABLE_CITIES } from "../graphql/queries/serviceablePincode.queries";

interface GetServiceableCitiesData {
  getServiceableCities: string[];
}

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export async function getServiceableCities(): Promise<string[]> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_SERVICEABLE_CITIES.loc?.source.body,
      }),
      next: { revalidate: 86400 }, // 1 day
    });

    if (!res.ok) {
      console.error("getServiceableCities: HTTP error", res.status);
      return [];
    }

    const json: { data?: GetServiceableCitiesData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error("getServiceableCities: GraphQL errors", json.errors);
      return [];
    }

    return json.data?.getServiceableCities ?? [];
  } catch (error) {
    console.error("getServiceableCities: fetch failed", error);
    return [];
  }
}
