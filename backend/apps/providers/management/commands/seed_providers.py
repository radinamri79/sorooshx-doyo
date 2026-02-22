from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.users.models import CustomUser
from apps.providers.models import Provider, ServiceCategory, ProviderService

import random
from decimal import Decimal


PROVIDERS = [
    {"business": "SparkleClean Pro", "category": "Home Cleaning", "city": "New York",
     "services": [("Deep House Cleaning", 150), ("Regular Weekly Cleaning", 80), ("Office Cleaning", 200)]},
    {"business": "PipeMaster", "category": "Plumbing", "city": "Los Angeles",
     "services": [("Emergency Pipe Repair", 120), ("Drain Cleaning", 90), ("Bathroom Remodel", 500)]},
    {"business": "BrightSpark Electric", "category": "Electrical", "city": "Chicago",
     "services": [("Electrical Inspection", 100), ("Outlet Installation", 75), ("Panel Upgrade", 350)]},
    {"business": "ColorSplash Painting", "category": "Painting", "city": "Houston",
     "services": [("Room Painting", 200), ("Full House Interior", 1200), ("Accent Wall", 100)]},
    {"business": "GreenThumb Gardens", "category": "Landscaping", "city": "Phoenix",
     "services": [("Lawn Maintenance", 60), ("Garden Design", 300), ("Tree Trimming", 150)]},
    {"business": "SwiftMove Co", "category": "Moving", "city": "San Francisco",
     "services": [("Studio Move", 250), ("2-Bedroom Move", 500), ("Packing Service", 150)]},
    {"business": "BrainBoost Tutoring", "category": "Tutoring", "city": "Seattle",
     "services": [("Math Tutoring (1hr)", 50), ("SAT Prep Session", 75), ("Science Lab Help", 60)]},
    {"business": "PawPerfect", "category": "Pet Care", "city": "Denver",
     "services": [("Dog Walking (30min)", 25), ("Pet Sitting (per day)", 50), ("Full Grooming", 65)]},
    {"business": "LensCraft Studios", "category": "Photography", "city": "Miami",
     "services": [("Portrait Session", 200), ("Event Coverage (4hr)", 600), ("Product Shoot", 300)]},
    {"business": "FitLife Training", "category": "Personal Training", "city": "Austin",
     "services": [("Personal Session", 70), ("Group Training", 30), ("Nutrition Plan", 100)]},
    {"business": "GlowUp Beauty", "category": "Beauty & Wellness", "city": "Portland",
     "services": [("Hair Styling", 85), ("Full Makeup", 120), ("Relaxation Massage", 95)]},
    {"business": "TechFix Solutions", "category": "IT Support", "city": "Boston",
     "services": [("Computer Repair", 80), ("Network Setup", 150), ("Data Recovery", 200)]},
]


class Command(BaseCommand):
    help = "Seed sample providers"

    def handle(self, *args, **options):
        created = 0
        for idx, prov_data in enumerate(PROVIDERS):
            email = f"provider{idx + 1}@doyo.example"
            user, _ = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "username": slugify(prov_data["business"]),
                    "first_name": prov_data["business"].split()[0],
                    "last_name": "Provider",
                    "is_provider": True,
                },
            )
            if not user.has_usable_password():
                user.set_password("doyopass123")
                user.save()

            provider, was_created = Provider.objects.get_or_create(
                user=user,
                defaults={
                    "business_name": prov_data["business"],
                    "description": f"Professional {prov_data['category'].lower()} services in {prov_data['city']}.",
                    "city": prov_data["city"],
                    "average_rating": Decimal(str(round(random.uniform(3.5, 5.0), 2))),
                    "total_reviews": random.randint(5, 120),
                    "total_orders": random.randint(10, 200),
                    "is_verified": True,
                    "is_available": True,
                },
            )

            if was_created:
                created += 1
                category = ServiceCategory.objects.filter(
                    slug=slugify(prov_data["category"])
                ).first()
                if category:
                    provider.categories.add(category)

                for svc_title, svc_price in prov_data["services"]:
                    ProviderService.objects.get_or_create(
                        provider=provider,
                        title=svc_title,
                        defaults={
                            "category": category or ServiceCategory.objects.first(),
                            "description": f"Professional {svc_title.lower()} service.",
                            "price": Decimal(str(svc_price)),
                            "duration_minutes": random.choice([30, 60, 90, 120]),
                        },
                    )

        self.stdout.write(self.style.SUCCESS(f"Created {created} providers"))
