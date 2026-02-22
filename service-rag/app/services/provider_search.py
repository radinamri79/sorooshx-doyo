import httpx
from app.config import settings


class ProviderSearch:
    def __init__(self):
        self.backend_url = settings.backend_url

    async def search_providers(self, category: str = None, city: str = None, search: str = None) -> list[dict]:
        params = {}
        if category:
            params["category"] = category
        if city:
            params["city"] = city
        if search:
            params["search"] = search

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.backend_url}/api/providers/",
                    params=params,
                )
                response.raise_for_status()
                data = response.json()
                return data.get("results", data) if isinstance(data, dict) else data
        except httpx.HTTPError:
            return []

    async def get_categories(self) -> list[dict]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.backend_url}/api/providers/categories/",
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError:
            return []
