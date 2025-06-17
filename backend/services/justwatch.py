from justwatch import JustWatch

def get_streaming_providers(title: str, country: str = "US"):
    """
    Returns a list of streaming platforms where the given title is available in the specified country.

    :param title: Movie or show title to search
    :param country: 2-letter country code (default is 'IN' for India)
    :return: List of dicts with 'platform' and 'link'
    """
    justwatch = JustWatch(country=country)
    results = justwatch.search_for_item(query=title)

    items = results.get('items')
    if not items:
        return []

    # Grab the first matching item
    item = items[0]

    offers = item.get("offers", [])
    providers = {}
    for offer in offers:
        provider = offer.get("provider_id")
        url = offer.get("urls", {}).get("standard_web")
        monetization_type = offer.get("monetization_type")

        if provider and url and monetization_type == "flatrate":  # Filter for subscription platforms
            provider_name = justwatch.get_provider(provider)["clear_name"]
            providers[provider_name] = url

    return [{"platform": name, "link": link} for name, link in providers.items()]
