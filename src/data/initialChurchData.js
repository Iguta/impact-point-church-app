// This is a single object that holds all initial editable church data
export const initialChurchData = {
  heroSlides: [
    {
      id: "slide1",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/impact-point-church.firebasestorage.app/o/image-1.jpg?alt=media&token=aeb4110e-db0f-4fbc-b6ce-7b04f181b97c",
      title: "Welcome to Impact Point Church",
      subtitle: "Where Faith Meets Purpose - Making a Lasting Impact in Our Community",
      ctaPrimaryText: "Join Us This Sunday",
      ctaPrimaryLink: "#services",
      ctaSecondaryText: "Learn More",
      ctaSecondaryLink: "#about",
    },
    {
      id: "slide2",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/impact-point-church.firebasestorage.app/o/image-2.jpg?alt=media&token=7f5dc801-bf43-46e4-8dfb-dd26fa21af53",
      title: "Growing in Faith Together",
      subtitle: "Discover Your Purpose and Connect with Our Community",
      ctaPrimaryText: "Explore Ministries",
      ctaPrimaryLink: "#ministries",
      ctaSecondaryText: "Watch Sermons",
      ctaSecondaryLink: "#sermons",
    },
    {
      id: "slide3",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/impact-point-church.firebasestorage.app/o/image-3.jpg?alt=media&token=229aa264-967c-4645-a1d0-e24e40f0199a",
      title: "Serving Our Community",
      subtitle: "Putting Love into Action, One Project at a Time",
      ctaPrimaryText: "See Events",
      ctaPrimaryLink: "#events",
      ctaSecondaryText: "Get Involved",
      ctaSecondaryLink: "#contact",
    },
  ],
  about: {
    title: "Our Mission",
    text: "At Impact Point Church, we believe that every person has the potential to make a meaningful impact in their community and beyond. We are a vibrant, welcoming community dedicated to growing in faith, serving others, and creating positive change in our world.\n\nFounded on the principles of love, compassion, and service, we strive to be a place where everyone can find their purpose and make a difference. Whether you're taking your first steps in faith or have been walking with God for years, you'll find a home here.",
    imageUrl: "/images/mission.jpg", // Image should be in public/images/ folder
  },
  liveStream: { // NEW Live Stream data object
    isLive: false, // Set to true when streaming
    embedUrl: "https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID&autoplay=1", // Replace with your church's YouTube Live embed URL or other platform's embed
    // Example for a specific YouTube video: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
    // For Facebook Live: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebookapp%2Fvideos%2F10153231379946729%2F&show_text=0&width=560"
    title: "Sunday Service Live",
    description: "Join us live every Sunday for worship and a powerful message!",
  },
  services: [
    {
      id: "service1",
      icon: "🌅",
      title: "Sunday Morning",
      time: "9:00 AM & 11:00 AM",
      description: "Join us for inspiring worship, biblical teaching, and community fellowship. Childcare and youth programs available.",
    },
    {
      id: "service2",
      icon: "🌙",
      title: "Wednesday Evening",
      time: "7:00 PM",
      description: "Midweek service featuring prayer, Bible study, and deeper community connection in a more intimate setting.",
    },
    {
      id: "service3",
      icon: "🎵",
      title: "Online Services",
      time: "Live Stream Available",
      description: "Can't make it in person? Join our live stream service and be part of our community from anywhere.",
    },
  ],
  sermons: [
    {
      id: "sermon1",
      title: "The Power of Forgiveness",
      speaker: "Pastor John Doe",
      date: "2024-06-30",
      description: "A message on the liberating power of forgiveness in our daily lives.",
      videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      audioLink: "#",
    },
    {
      id: "sermon2",
      title: "Living a Life of Purpose",
      speaker: "Guest Speaker Jane Smith",
      date: "2024-06-23",
      description: "Exploring what it means to live intentionally and fulfill God's calling.",
      videoLink: "#",
      audioLink: "#",
    },
  ],
  events: [
    {
      id: "event1",
      title: "Community BBQ & Baptism Service",
      date: "Sunday, July 6th",
      time: "10:00 AM - 2:00 PM",
      location: "Church Grounds",
      description: "Join us for a special outdoor service followed by a community barbecue. We'll also be celebrating baptisms!",
    },
    {
      id: "event2",
      title: "Vacation Bible School",
      date: "July 15-19",
      time: "All Week",
      location: "Church Campus",
      description: "An exciting week of learning, games, and fun for children ages 4-12. Registration now open!",
    },
    {
      id: "event3",
      title: "Community Service Day",
      date: "Saturday, July 26th",
      time: "9:00 AM - 3:00 PM",
      location: "Various City Locations",
      description: "Join us as we serve our community through various volunteer projects around the city.",
    },
    {
      id: "event4",
      title: "Youth Summer Retreat",
      date: "August 2-4",
      time: "All Weekend",
      location: "Camp Grounds",
      description: "A weekend getaway for our youth to grow in faith, build friendships, and have amazing adventures.",
    },
  ],
  ministries: [
    { name: "Children's Ministry", description: "Engaging programs for kids from nursery through 5th grade, helping them discover God's love through fun activities and age-appropriate teaching." },
    { name: "Youth Group", description: "Building faith and community for teenagers." },
    { name: "Community Outreach", description: "Making a real impact through food banks, community service projects, and partnerships with local organizations." },
    { name: "Small Groups", description: "Build deeper relationships and grow in faith through our various small group Bible studies and fellowship groups." },
    { name: "Worship Ministry", description: "Join our worship team and use your musical gifts to lead others in praise and worship every Sunday." },
    { name: "Seniors Ministry", description: "Fellowship, Bible study, and special activities designed for our senior community members." },
  ],
  contact: {
    address: "546 E 17th St #100\nIndianapolis, IN 46202",
    serviceTimes: "Sundays at 9:00 AM & 11:00 AM",
    email: "info@impactpointchurch.org",
    phone: "+1 (317) 555-PRAY",
    officeHours: "Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2910.0504771023648!2d-86.15001572436468!3d39.79056309351256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886b50e3a13e5617%3A0x6ab50bd5429bd61c!2s546%20E%2017th%20St%20%23100%2C%20Indianapolis%2C%20IN%2046202!5e1!3m2!1sen!2sus!4v1764119954880!5m2!1sen!2sus",
  },
};
