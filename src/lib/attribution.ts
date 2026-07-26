// Lead Attribution and CRM intelligence helpers

export function getBrowserName(ua: string): string {
  const userAgent = ua.toLowerCase();
  if (userAgent.includes("edg/")) return "Edge";
  if (userAgent.includes("firefox/")) return "Firefox";
  if (userAgent.includes("chrome/") && !userAgent.includes("chromium/")) return "Chrome";
  if (userAgent.includes("safari/") && !userAgent.includes("chrome/")) return "Safari";
  return "Other";
}

export function getDeviceType(ua: string): string {
  const userAgent = ua.toLowerCase();
  if (/mobi|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return "Mobile";
  }
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
    return "Tablet";
  }
  // Fallback to screen width checks if we are on client side
  if (typeof window !== "undefined") {
    const width = window.innerWidth;
    if (width < 768) return "Mobile";
    if (width >= 768 && width < 1024) return "Tablet";
  }
  return "Desktop";
}

export function generateReferenceId(): string {
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  
  // Generate a random 4-character uppercase hex string
  const randomHex = Math.floor(16 + Math.random() * 240) // ensures 2 digits
    .toString(16)
    .toUpperCase() + 
    Math.floor(16 + Math.random() * 240)
    .toString(16)
    .toUpperCase();
    
  return `KASH-${year}${month}${day}-${randomHex.slice(0, 4)}`;
}

export function determineTrafficSource(): string {
  if (typeof window === "undefined") return "Direct";
  
  // 1. Check if we already have it in sessionStorage
  const cached = sessionStorage.getItem("kash_traffic_source");
  if (cached) return cached;
  
  // 2. Check UTM Parameters
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  
  if (utmSource) {
    const source = utmSource.toLowerCase();
    let resolved = "Other";
    if (source.includes("linkedin")) resolved = "LinkedIn";
    else if (source.includes("instagram")) resolved = "Instagram";
    else if (source.includes("whatsapp")) resolved = "WhatsApp";
    else if (source.includes("github")) resolved = "GitHub";
    else if (source.includes("google")) resolved = "Google";
    else if (source.includes("reddit")) resolved = "Reddit";
    else resolved = utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
    
    sessionStorage.setItem("kash_traffic_source", resolved);
    return resolved;
  }
  
  // 3. Check Referrer
  const referrer = document.referrer;
  if (referrer) {
    const refLower = referrer.toLowerCase();
    let resolved = "Referral";
    if (refLower.includes("linkedin.com")) resolved = "LinkedIn";
    else if (refLower.includes("instagram.com")) resolved = "Instagram";
    else if (refLower.includes("wa.me") || refLower.includes("whatsapp.com")) resolved = "WhatsApp";
    else if (refLower.includes("github.com")) resolved = "GitHub";
    else if (refLower.includes("google.com")) resolved = "Google";
    else if (refLower.includes("reddit.com")) resolved = "Reddit";
    
    sessionStorage.setItem("kash_traffic_source", resolved);
    return resolved;
  }
  
  // 4. Default to Direct
  sessionStorage.setItem("kash_traffic_source", "Direct");
  return "Direct";
}

export function getLandingPage(pathname: string): string {
  if (typeof window === "undefined") return pathname;
  
  const cached = sessionStorage.getItem("kash_landing_page");
  if (cached) return cached;
  
  sessionStorage.setItem("kash_landing_page", pathname);
  return pathname;
}
