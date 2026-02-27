from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.providers.models import ServiceCategory


CATEGORIES = [
    {
        "name": "Featured Tasks",
        "slug": "featured",
        "icon": "star",
        "description": "Let Taskers help tackle your to-do list.",
        "children": [
            ("Furniture Assembly", "assemble-furniture"),
            ("Home Repairs", "general-handyman"),
            ("Snow Removal", "snow-removal"),
            ("Heavy Lifting", "heavy-lifting"),
            ("Home Cleaning", "home-cleaning"),
            ("TV Mounting", "wall-mount-tv"),
            ("Plumbing", "plumbing"),
            ("Hang Art, Mirror & Decor", "hang-pictures"),
            ("Electrical Help", "electrical-work"),
            ("Wait in Line", "waiting-in-line"),
            ("Closet Organization", "closet-organization"),
        ],
    },
    {
        "name": "Handyman",
        "slug": "handyman",
        "icon": "wrench",
        "description": "Hire a Tasker for help around the house.",
        "children": [
            ("Door, Cabinet & Furniture Repair", "door-and-cabinet-repair"),
            ("Appliance Installation & Repairs", "appliance-repairs"),
            ("Furniture Assembly", "assemble-furniture"),
            ("TV Mounting", "wall-mount-tv"),
            ("Drywall Repair", "drywall-repair"),
            ("Flooring & Tiling Help", "flooring-tiling-help"),
            ("Electrical Help", "electrical-work"),
            ("Sealing & Caulking", "sealing-caulking"),
            ("Plumbing", "plumbing"),
            ("Window & Blinds Repair", "window-repair"),
            ("Ceiling Fan Installation", "ceiling-fan-installation"),
            ("Smart Home Installation", "smart-home-installation"),
            ("Heavy Lifting", "heavy-lifting"),
            ("Install Air Conditioner", "install-air-conditioner"),
            ("Painting", "painting"),
            ("Install Shelves, Rods & Hooks", "shelf-mounting"),
            ("Home Maintenance", "home-maintenance"),
            ("Install Blinds & Window Treatments", "blinds-installation"),
            ("Home Repairs", "general-handyman"),
            ("Baby Proofing", "baby-proofing"),
            ("Yard Work", "yard-work-removal"),
            ("Light Installation", "light-installation"),
            ("Carpentry Services", "carpentry-construction"),
            ("Hang Art, Mirror & Decor", "hang-pictures"),
            ("General Mounting", "mounting-all"),
            ("Cabinet Installation", "cabinet-installation"),
            ("Wallpapering", "wallpapering"),
            ("Fence Installation & Repair", "fence-installation"),
            ("Deck Restoration", "deck-restoration"),
            ("Doorbell Installation", "doorbell-installation"),
            ("Home Theater Setup", "home-theater-setup"),
        ],
    },
    {
        "name": "Moving Services",
        "slug": "moving",
        "icon": "truck",
        "description": "From the heavy lifting to unpacking and organizing, make your move with Doyo!",
        "children": [
            ("Help Moving", "help-moving"),
            ("Truck Assisted Help Moving", "truck-assisted-help-moving"),
            ("Packing Services & Help", "packing"),
            ("Unpacking Services", "unpacking"),
            ("Heavy Lifting", "heavy-lifting"),
            ("Local Movers", "local-movers"),
            ("Junk Pickup", "junk-removal"),
            ("Furniture Movers", "furniture-movers"),
            ("One Item Movers", "one-piece-of-furniture"),
            ("Storage Unit Moving", "storage-unit-moving"),
            ("Couch Removal", "couch-removal"),
            ("Mattress Pick-Up & Removal", "mattress-removal"),
            ("Furniture Removal", "furniture-removal"),
            ("Pool Table Movers", "pool-table-movers"),
            ("Appliance Removal", "appliance-removal"),
            ("Heavy Furniture Moving", "heavy-furniture"),
            ("Rearranging Furniture", "rearranging-furniture"),
            ("Full Service Help Moving", "full-service-movers"),
            ("In-Home Furniture Movers", "in-home-furniture-movers"),
        ],
    },
    {
        "name": "Furniture Assembly",
        "slug": "furniture-assembly",
        "icon": "sofa",
        "description": "Get your furniture assembled by a skilled Tasker.",
        "children": [
            ("General Furniture Assembly", "assemble-furniture"),
            ("Patio Furniture Assembly", "patio-furniture-assembly"),
            ("Desk Assembly", "desk-assembly"),
            ("Dresser Assembly", "dresser-assembly"),
            ("Bed Assembly", "bed-assembly"),
            ("Bookshelf Assembly", "bookshelf-assembly"),
            ("Couch Assembly", "couch-assembly"),
            ("Chair Assembly", "chair-assembly"),
            ("Wardrobe Assembly", "wardrobe-assembly"),
            ("Table Assembly", "table-assembly"),
            ("Disassemble Furniture", "furniture-disassembly"),
        ],
    },
    {
        "name": "Mounting & Installation",
        "slug": "mounting",
        "icon": "monitor",
        "description": "Wall mounting and installation services.",
        "children": [
            ("TV Mounting", "wall-mount-tv"),
            ("Install Shelves, Rods & Hooks", "shelf-mounting"),
            ("Ceiling Fan Installation", "ceiling-fan-installation"),
            ("Install Blinds & Window Treatments", "blinds-installation"),
            ("Hang Art, Mirror & Decor", "hang-pictures"),
            ("General Mounting", "mounting-all"),
            ("Hang Christmas Lights", "christmas-light-installation"),
        ],
    },
    {
        "name": "Cleaning",
        "slug": "cleaning",
        "icon": "sparkles",
        "description": "Taskers will make your home sparkle!",
        "children": [
            ("House Cleaning", "house-cleaning"),
            ("Deep Cleaning", "deep-cleaning"),
            ("Disinfecting Services", "disinfecting-service"),
            ("Move In Cleaning", "move-in"),
            ("Move Out Cleaning", "move-out"),
            ("Vacation Rental Cleaning", "airbnb"),
            ("Carpet Cleaning", "carpet-cleaning"),
            ("Garage Cleaning", "garage-cleaning"),
            ("One Time Cleaning", "one-time"),
            ("Car Washing", "mobile-car-wash"),
            ("Laundry Help", "laundry-help"),
            ("Pressure Washing", "pressure-washing"),
            ("Spring Cleaning", "spring-cleaning"),
        ],
    },
    {
        "name": "Shopping & Delivery",
        "slug": "shopping-delivery",
        "icon": "shopping-cart",
        "description": "Get anything from groceries to furniture delivered.",
        "children": [
            ("Delivery Service", "delivery-service"),
            ("Grocery Shopping & Delivery", "grocery-shopping"),
            ("Running Your Errands", "run-errands"),
            ("Christmas Tree Delivery", "christmas-tree-delivery"),
            ("Wait in Line", "waiting-in-line"),
            ("Deliver Big Furniture", "deliver-big-piece-of-furniture"),
            ("Drop Off Donations", "drop-off-donations"),
            ("Contactless Delivery", "pick-up-delivery"),
            ("Pet Food Delivery", "dog-food-delivery"),
            ("Baby Food Delivery", "baby-food-delivery"),
            ("Return Items", "return-items"),
            ("Wait for Delivery", "wait-for-delivery"),
            ("Shipping", "shipping"),
        ],
    },
    {
        "name": "IKEA Services",
        "slug": "ikea-services",
        "icon": "home",
        "description": "Hire a Tasker for all your IKEA needs.",
        "children": [
            ("Light Installation", "light-installation"),
            ("Furniture Removal", "furniture-removal"),
            ("Smart Home Installation", "smart-home-installation"),
            ("Organization", "organization"),
            ("Furniture Assembly", "assemble-furniture"),
            ("General Mounting", "mounting-all"),
        ],
    },
    {
        "name": "Yardwork Services",
        "slug": "yardwork",
        "icon": "tree-pine",
        "description": "Hire a Tasker to help with yardwork & landscaping!",
        "children": [
            ("Gardening Services", "gardening"),
            ("Weed Removal", "weeding"),
            ("Lawn Care", "lawn-care"),
            ("Lawn Mowing", "lawn-mowing"),
            ("Landscaping", "landscaping"),
            ("Gutter Cleaning", "gutter-cleaning"),
            ("Tree Trimming", "tree-trimming"),
            ("Vacation Plant Watering", "vacation-plant-watering"),
            ("Patio Cleaning", "patio-cleaning"),
            ("Hot Tub Cleaning", "hot-tub-cleaning"),
            ("Fence Installation & Repair", "fence-installation"),
            ("Deck Restoration", "deck-restoration"),
            ("Patio Furniture Assembly", "patio-furniture-assembly"),
            ("Fence Staining", "fence-staining"),
            ("Mulching", "mulching"),
            ("Lawn Fertilizer", "lawn-fertilizer"),
            ("Hedge Trimming", "hedge-trimming"),
            ("Outdoor Party Setup", "outdoor-party-setup"),
            ("Urban Gardening", "urban-gardening"),
            ("Leaf Raking & Removal", "leaf-removal"),
            ("Produce Gardening", "produce-gardening"),
            ("Hose Installation", "hose-installation"),
            ("Shed Maintenance", "shed-maintenance"),
            ("Pressure Washing", "pressure-washing"),
        ],
    },
    {
        "name": "Holidays",
        "slug": "holidays",
        "icon": "gift",
        "description": "Get holiday help from trusted Taskers.",
        "children": [
            ("Gift Wrapping", "gift-wrapping"),
            ("Hang Christmas Lights", "christmas-light-installation"),
            ("Christmas Tree Delivery", "christmas-tree-delivery"),
            ("Holiday Decorating", "christmas-decorator"),
            ("Party Cleaning", "party-cleaning"),
            ("Toy Assembly", "toy-assembly"),
            ("Wait in Line", "waiting-in-line"),
            ("Christmas Tree Removal", "tree-removal"),
        ],
    },
    {
        "name": "Winter Tasks",
        "slug": "winter-tasks",
        "icon": "snowflake",
        "description": "Get help with winter tasks.",
        "children": [
            ("Snow Removal", "snow-removal"),
            ("Sidewalk Salting", "sidewalk-snow-removal"),
            ("Window Winterization", "window-winterization"),
            ("Residential Snow Removal", "residential-snow-removal"),
            ("Christmas Tree Removal", "tree-removal"),
            ("AC Winterization", "ac-winterization"),
            ("Winter Yardwork", "winter-yardwork"),
            ("Pipe Insulation", "pipe-insulation"),
            ("Storm Door Installation", "storm-door-installation"),
            ("Winter Deck Maintenance", "winter-deck-maintenance"),
            ("Water Heater Maintenance", "water-heater-maintenance"),
            ("Wait in Line", "waiting-in-line"),
        ],
    },
    {
        "name": "Personal Assistant",
        "slug": "personal-assistant",
        "icon": "user",
        "description": "Hire a Tasker to be your personal assistant!",
        "children": [
            ("Personal Assistant", "personal-assistant-service"),
            ("Running Your Errands", "run-errands"),
            ("Wait in Line", "waiting-in-line"),
            ("Organization", "organization"),
            ("Organize Home", "home-organization"),
            ("Closet Organization", "closet-organization"),
            ("Interior Design", "interior-design"),
            ("Virtual Assistant", "virtual-assistant"),
        ],
    },
    {
        "name": "Baby Prep",
        "slug": "baby-prep",
        "icon": "baby",
        "description": "Set up the nursery, childproof your home, and more.",
        "children": [
            ("Baby Proofing", "baby-proofing"),
            ("Baby Food Delivery", "baby-food-delivery"),
            ("Organize a Room", "organize-a-room"),
            ("Painting", "painting"),
            ("Toy Assembly", "toy-assembly"),
            ("Smart Home Installation", "smart-home-installation"),
            ("Shopping", "need-us-to-shop-for-something"),
            ("General Cleaning", "need-something-else-cleaned"),
        ],
    },
    {
        "name": "Virtual & Online Tasks",
        "slug": "online-tasks",
        "icon": "laptop",
        "description": "Virtual assistance, organization, research, and more.",
        "children": [
            ("Virtual Assistant", "virtual-assistant"),
            ("Organization", "organization"),
            ("Data Entry", "data-entry-clerk"),
            ("Computer Help", "computer-help"),
        ],
    },
    {
        "name": "Office Services",
        "slug": "office",
        "icon": "building",
        "description": "Hire a Tasker to help around the office!",
        "children": [
            ("Office Cleaning", "commercial-cleaning"),
            ("Office Tech Setup", "conference-room"),
            ("Office Movers", "movers"),
            ("Office Supply & Snack Delivery", "supply-snack-delivery"),
            ("Office Furniture Assembly", "furniture-assembly-setup"),
            ("Office Setup & Organization", "organization-setup"),
            ("Office Administration", "office-administration"),
            ("Office Interior Design", "office-interior-design"),
            ("Moving Office Furniture", "office-furniture-moving"),
            ("Office Mounting", "office-mounting"),
        ],
    },
    {
        "name": "Contactless Tasks",
        "slug": "contactless",
        "icon": "shield",
        "description": "No-contact delivery, shopping, and errands.",
        "children": [
            ("Contactless Delivery", "pick-up-delivery"),
            ("Prescription Pick-up & Delivery", "prescription-delivery"),
            ("Running Your Errands", "run-errands"),
            ("Grocery Shopping & Delivery", "grocery-shopping"),
            ("Disinfecting Services", "disinfecting-service"),
            ("Drop Off Donations", "drop-off-donations"),
            ("Yard Work", "yard-work-removal"),
            ("Virtual Assistant", "virtual-assistant"),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed service categories based on TaskRabbit structure"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing categories before seeding",
        )

    def handle(self, *args, **options):
        if options["reset"]:
            count = ServiceCategory.objects.count()
            ServiceCategory.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {count} existing categories"))

        created = 0
        for cat_data in CATEGORIES:
            parent, was_created = ServiceCategory.objects.get_or_create(
                slug=cat_data["slug"],
                defaults={
                    "name": cat_data["name"],
                    "icon": cat_data.get("icon", ""),
                    "description": cat_data.get("description", ""),
                },
            )
            if was_created:
                created += 1

            for child_name, child_slug in cat_data.get("children", []):
                # Subcategory slugs are scoped to parent via the parent FK
                _, child_created = ServiceCategory.objects.get_or_create(
                    slug=child_slug,
                    parent=parent,
                    defaults={
                        "name": child_name,
                        "description": f"{child_name} services",
                    },
                )
                if child_created:
                    created += 1

        total = ServiceCategory.objects.count()
        self.stdout.write(
            self.style.SUCCESS(f"Created {created} categories. Total: {total}")
        )

        self.stdout.write(self.style.SUCCESS(f"Created {created} categories"))
