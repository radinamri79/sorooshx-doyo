from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.providers.models import ServiceCategory


CATEGORIES = [
    {"name": "Home Cleaning", "icon": "sparkles", "children": ["Deep Cleaning", "Regular Cleaning", "Move-in/out Cleaning"]},
    {"name": "Plumbing", "icon": "wrench", "children": ["Pipe Repair", "Drain Cleaning", "Fixture Installation"]},
    {"name": "Electrical", "icon": "zap", "children": ["Wiring", "Lighting", "Panel Upgrade"]},
    {"name": "Painting", "icon": "paintbrush", "children": ["Interior Painting", "Exterior Painting", "Wallpaper"]},
    {"name": "Landscaping", "icon": "tree-pine", "children": ["Lawn Care", "Garden Design", "Tree Trimming"]},
    {"name": "Moving", "icon": "truck", "children": ["Local Moving", "Long Distance", "Packing"]},
    {"name": "Tutoring", "icon": "book-open", "children": ["Math", "Science", "Languages"]},
    {"name": "Pet Care", "icon": "dog", "children": ["Dog Walking", "Pet Sitting", "Grooming"]},
    {"name": "Photography", "icon": "camera", "children": ["Portrait", "Event", "Product"]},
    {"name": "Personal Training", "icon": "dumbbell", "children": ["Fitness", "Yoga", "Nutrition"]},
    {"name": "Beauty & Wellness", "icon": "heart", "children": ["Hair Styling", "Makeup", "Massage"]},
    {"name": "Auto Repair", "icon": "car", "children": ["Oil Change", "Brake Repair", "Tire Service"]},
    {"name": "IT Support", "icon": "monitor", "children": ["Computer Repair", "Network Setup", "Data Recovery"]},
    {"name": "Carpentry", "icon": "hammer", "children": ["Furniture Repair", "Custom Builds", "Cabinet Making"]},
    {"name": "HVAC", "icon": "thermometer", "children": ["AC Repair", "Heating", "Duct Cleaning"]},
    {"name": "Roofing", "icon": "home", "children": ["Roof Repair", "Gutter Cleaning", "Inspection"]},
    {"name": "Catering", "icon": "utensils", "children": ["Events", "Private Chef", "Meal Prep"]},
    {"name": "Music Lessons", "icon": "music", "children": ["Piano", "Guitar", "Vocals"]},
    {"name": "Tailoring", "icon": "scissors", "children": ["Alterations", "Custom Clothing", "Repairs"]},
    {"name": "Event Planning", "icon": "calendar", "children": ["Weddings", "Corporate", "Parties"]},
]


class Command(BaseCommand):
    help = "Seed service categories"

    def handle(self, *args, **options):
        created = 0
        for cat_data in CATEGORIES:
            parent, was_created = ServiceCategory.objects.get_or_create(
                slug=slugify(cat_data["name"]),
                defaults={
                    "name": cat_data["name"],
                    "icon": cat_data["icon"],
                    "description": f"Services related to {cat_data['name'].lower()}",
                },
            )
            if was_created:
                created += 1
            for child_name in cat_data.get("children", []):
                _, child_created = ServiceCategory.objects.get_or_create(
                    slug=slugify(child_name),
                    defaults={
                        "name": child_name,
                        "parent": parent,
                        "description": f"{child_name} services",
                    },
                )
                if child_created:
                    created += 1

        self.stdout.write(self.style.SUCCESS(f"Created {created} categories"))
