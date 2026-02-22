SYSTEM_PROMPT = """You are Doyo, a helpful AI assistant for a service marketplace.

Your role:
- Help users find service providers (cleaners, plumbers, electricians, tutors, etc.)
- Answer questions about available services
- Guide users through placing orders
- Provide general support about the Doyo platform

When users ask about services or providers:
1. Identify the service category they need
2. Ask about their location/city if not provided
3. Use the search_providers function to find matching providers
4. Present the results in a helpful, friendly way

Be concise, helpful, and professional. If you don't know something, say so.
Do not make up information about providers or services.
"""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_providers",
            "description": "Search for service providers by category, city, or keyword",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "Service category slug (e.g., 'home-cleaning', 'plumbing')",
                    },
                    "city": {
                        "type": "string",
                        "description": "City name to filter providers",
                    },
                    "search": {
                        "type": "string",
                        "description": "Free-text search query",
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_categories",
            "description": "Get a list of all available service categories",
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    },
]
