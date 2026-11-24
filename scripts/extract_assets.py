import os
import subprocess

os.makedirs("public/images/hero", exist_ok=True)
os.makedirs("public/images/about", exist_ok=True)
os.makedirs("public/images/projects", exist_ok=True)
os.makedirs("public/images/services", exist_ok=True)
os.makedirs("public/images/team", exist_ok=True)
os.makedirs("public/images/office", exist_ok=True)

def crop(src, dest, top, left, h, w):
    cmd = ["sips", "--cropToHeightWidth", str(h), str(w), "--cropOffset", str(top), str(left), src, "--out", dest]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL)
    print(f"Cropped {dest}: {w}x{h} from ({left}, {top})")

HOME = "public/images/design-ref/media_1795515979788_37c5151a.jpg"
SERVICES = "public/images/design-ref/media_1795515979784_5e150ebd.jpg"
PORTFOLIO = "public/images/design-ref/media_1795515979795_fc4f4aed.jpg"
ABOUT = "public/images/design-ref/media_1795515979791_8cfa3726.jpg"
CONTACT = "public/images/design-ref/media_1795515979783_64418f38.jpg"

print("Extracting assets...")

crop(HOME, "public/images/hero/hero-laptop-composition.png", 55, 360, 215, 320)
crop(HOME, "public/images/about/home-office.png", 605, 32, 135, 290)

crop(HOME, "public/images/projects/exora-preview.png", 460, 200, 70, 110)
crop(HOME, "public/images/projects/launchpad-preview.png", 460, 318, 70, 112)
crop(HOME, "public/images/projects/kasba-preview.png", 460, 435, 70, 110)
crop(HOME, "public/images/projects/fuelops-preview.png", 460, 548, 70, 112)

crop(PORTFOLIO, "public/images/projects/portfolio-exora-hero.png", 405, 80, 170, 385)

crop(PORTFOLIO, "public/images/projects/schoolsync-mockup.png", 665, 70, 85, 125)
crop(PORTFOLIO, "public/images/projects/launchpad-mockup.png", 665, 350, 85, 125)
crop(PORTFOLIO, "public/images/projects/kasba-mockup.png", 665, 630, 85, 125)
crop(PORTFOLIO, "public/images/projects/ratna-ivf-mockup.png", 765, 70, 85, 125)
crop(PORTFOLIO, "public/images/projects/fuelops-mockup.png", 765, 350, 85, 125)
crop(PORTFOLIO, "public/images/projects/taxisegrator-mockup.png", 765, 630, 85, 125)

crop(SERVICES, "public/images/services/services-hero-laptop.png", 80, 355, 165, 320)
crop(SERVICES, "public/images/services/service-branding.png", 400, 32, 85, 150)
crop(SERVICES, "public/images/services/service-web.png", 400, 190, 85, 150)
crop(SERVICES, "public/images/services/service-dev.png", 400, 350, 85, 150)
crop(SERVICES, "public/images/services/service-creative.png", 400, 508, 85, 150)

crop(ABOUT, "public/images/about/about-hero-reception.png", 40, 340, 195, 335)
crop(ABOUT, "public/images/about/about-story-office.png", 308, 32, 175, 290)
crop(ABOUT, "public/images/about/about-studio-office.png", 800, 32, 120, 285)

crop(ABOUT, "public/images/team/daksh-singh.png", 670, 48, 75, 75)
crop(ABOUT, "public/images/team/creative-lead.png", 670, 176, 75, 75)
crop(ABOUT, "public/images/team/product-lead.png", 670, 305, 75, 75)
crop(ABOUT, "public/images/team/marketing-lead.png", 670, 435, 75, 75)
crop(ABOUT, "public/images/team/business-lead.png", 670, 565, 75, 75)

crop(CONTACT, "public/images/about/contact-hero-office.png", 60, 510, 265, 500)
crop(CONTACT, "public/images/about/contact-map.png", 415, 290, 105, 225)

print("All assets successfully extracted!")
