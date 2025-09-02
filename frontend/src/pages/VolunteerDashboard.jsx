import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Website.css";
import { useNavigate } from "react-router-dom";
import { getBotReply, quickSuggestions } from "../chatbot/botLogic";


const Website = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;
  const logout = authContext?.logout || (() => console.log("Logout clicked"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New event: Beach Cleanup this weekend!", read: false },
    { id: 2, text: "Your volunteer hours have been updated", read: false },
    { id: 3, text: "Welcome to our community!", read: true }
  ]);
  
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! How can we help you today?", sender: "support" }
  ]);
  const [message, setMessage] = useState("");
  
  const videoRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Statistics counter
  const [stats, setStats] = useState({
    volunteers: 0,
    events: 0,
    hours: 0,
    communities: 0
  });

  // Live volunteer counter (simulated)
  const [liveCounter, setLiveCounter] = useState(5127);
  
  // Volunteer spotlight data
  const volunteerSpotlights = [
    {
      id: 1,
      name: "Emma Rodriguez",
      role: "Community Volunteer",
      image: "/images/volunteer1.jpg",
      quote: "This platform helped me find meaningful opportunities that match my skills and schedule.",
      contributions: "120+ hours volunteered",
      badges: ["Eco Warrior", "Community Champion", "Top Contributor"]
    },
    {
      id: 2,
      name: "James Wilson",
      role: "Event Organizer",
      image: "/images/volunteer2.jpg",
      quote: "Managing volunteers has never been easier. The tracking and communication tools are exceptional.",
      contributions: "Organized 15+ events",
      badges: ["Leadership", "Event Master", "Community Builder"]
    },
    {
      id: 3,
      name: "Sophia Chen",
      role: "Youth Coordinator",
      image: "/images/volunteer3.jpg",
      quote: "I've been able to engage our youth group in community service like never before.",
      contributions: "Mobilized 50+ students",
      badges: ["Youth Mentor", "Community Inspire", "Top Recruiter"]
    }
  ];

  // Event locations for map
  const eventLocations = [
    { id: 1, name: "Beach Cleanup", lat: 40.7128, lng: -74.0060, volunteers: 24 },
    { id: 2, name: "Food Bank", lat: 34.0522, lng: -118.2437, volunteers: 18 },
    { id: 3, name: "Tree Planting", lat: 41.8781, lng: -87.6298, volunteers: 32 },
    { id: 4, name: "Senior Support", lat: 29.7604, lng: -95.3698, volunteers: 12 }
  ];

  // Resource library
  const resources = [
    { 
      id: 1, 
      title: "Volunteer Handbook", 
      description: "Complete guide for volunteers", 
      icon: "fas fa-book",
      link: "/resources/handbook.pdf"
    },
    { 
      id: 2, 
      title: "Event Planning Toolkit", 
      description: "Resources for organizing successful events", 
      icon: "fas fa-toolbox",
      link: "/resources/toolkit.zip"
    },
    { 
      id: 3, 
      title: "Safety Guidelines", 
      description: "Important safety information for all events", 
      icon: "fas fa-first-aid",
      link: "/resources/safety.pdf"
    },
    { 
      id: 4, 
      title: "Training Videos", 
      description: "Video tutorials for volunteers and organizers", 
      icon: "fas fa-video",
      link: "/resources/videos"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How do I sign up as a volunteer?",
      answer: "Simply click on the 'Register' button at the top of the page, fill out your information, and select 'Volunteer' as your role. You'll then be able to browse and sign up for events."
    },
    {
      question: "Can organizations create events?",
      answer: "Yes! Organizations can register and create events. After registration, you'll need to verify your organization status, then you can start creating and managing events."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, we have a mobile-responsive website that works on all devices. We're developing a dedicated mobile app that will be released later this year."
    },
    {
      question: "How are volunteer hours tracked?",
      answer: "Volunteer hours are tracked through event check-ins managed by organizers. You can also self-report hours for approval, and all hours are visible in your personal dashboard."
    },
    {
      question: "Are there any fees to use the platform?",
      answer: "The platform is completely free for volunteers. Organizations may have premium features available, but basic event creation and volunteer management are free."
    }
  ];

  // Video autoplay + force loop
  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Try autoplay
      video.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });

      // Force loop in case the browser ignores 'loop'
      const handleEnded = () => {
        video.currentTime = 0;
        video.play();
      };

      video.addEventListener("ended", handleEnded);

      // Cleanup listener
      return () => {
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Show/hide back to top button
      const backToTop = document.querySelector('.back-to-top');
      if (backToTop) {
        if (window.scrollY > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
      
      // Animate elements on scroll
      animateOnScroll();
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.classList.add('animated');
      }
    });
  };

  // Statistics counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        volunteers: prev.volunteers < 5000 ? prev.volunteers + 25 : 5000,
        events: prev.events < 250 ? prev.events + 1 : 250,
        hours: prev.hours < 10000 ? prev.hours + 100 : 10000,
        communities: prev.communities < 50 ? prev.communities + 1 : 50
      }));
    }, 100);

    // Clean up interval after 3 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Simulate live volunteer counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log("Subscribed with email:", email);
      setSubscribed(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // In a real app, you would update all text content based on the selected language
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };
const handleChatSubmit = (e) => {
  e.preventDefault();
  const text = message.trim();
  if (!text) return;

  // add user message
  const userMsg = { id: Date.now(), text, sender: "user" };
  setChatMessages((prev) => [...prev, userMsg]);
  setMessage("");

  // bot reply
  const replyText = getBotReply(text);
  setTimeout(() => {
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: replyText, sender: "bot" },
    ]);
  }, 600);
};



  const shareOnSocialMedia = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this amazing volunteer platform!");
    
    let shareUrl;
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="website-container">
      {/* Back to Top Button */}
      <button 
        className="back-to-top" 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      {/* Theme Toggle */}
      <button 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
      </button>

      {/* Language Toggle */}
      <div className="language-toggle">
        <button 
          className={language === 'en' ? 'active' : ''} 
          onClick={() => handleLanguageChange('en')}
        >
          EN
        </button>
        <button 
          className={language === 'es' ? 'active' : ''} 
          onClick={() => handleLanguageChange('es')}
        >
          ES
        </button>
      </div>

      {/* Live Support Chat */}
      <div className={`chat-support ${showChat ? 'active' : ''}`}>
        <button className="chat-toggle" onClick={toggleChat}>
          <i className="fas fa-comments"></i>
          <span className="notification-dot"></span>
        </button>
        
        <div className="chat-container">
          <div className="chat-header">
            <h3>Support Chat</h3>
            <button className="chat-close" onClick={toggleChat}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chat-messages" ref={chatContainerRef}>
            {chatMessages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          {/* Quick Replies */}
          
<div className="quick-replies">
  {quickSuggestions.map((q) => (
    <button
      key={q.id}
      type="button"
      className="chip"
      onClick={() => {
        // show user message
        const userMsg = { id: Date.now(), text: q.question, sender: "user" };
        setChatMessages((prev) => [...prev, userMsg]);

        // show bot reply
        const replyText = getBotReply(q.question);
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, text: replyText, sender: "bot" },
          ]);
        }, 400);

        // optional: navigate
        if (q.navigate) navigate(q.navigate);
      }}
    >
      {q.label}
    </button>
  ))}
</div>

          
          <form className="chat-input" onSubmit={handleChatSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>

      {/* Notification Bell */}
      <div className="notifications-wrapper">
        <button className="notification-bell">
          <i className="fas fa-bell"></i>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="notification-count">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>
        
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button className="mark-all-read">Mark all as read</button>
          </div>
          
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <p>{notification.text}</p>
                <span className="notification-time">2h ago</span>
              </div>
            ))}
          </div>
          
          <div className="notifications-footer">
            <a href="/notifications">View all notifications</a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} aria-label="Main navigation">
        <div className="logo">
          <img
            src="/video/logo.png"
            alt="Event Volunteer Tracker Logo"
            className="logo-img spin-on-hover"
          />
          <span className="logo-text">Event Volunteer Tracker</span>
        </div>
        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
          {user?.role === "volunteer" && (

)}

        </button>
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/VolunteerEvent" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/VolunteerEvents" onClick={() => setIsMenuOpen(false)}>Events</Link>
          </li>
          <li>
            <Link to="/volunteers" onClick={() => setIsMenuOpen(false)}>Upcoming Events</Link>
          </li>
          {user ? (
            <>
              <li className="user-greeting">Hello, {user.name}</li>
              <li>
                <button onClick={logout} className="btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Hero Section with Video Background */}
      <header className="hero-section">
        <div className="video-background">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="video-bg"
            poster="/video/poster.jpg"
          >
            <source src="/video/projector.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>

        <div className="hero-content animate-fade-in">
          <div className="live-counter">
            <i className="fas fa-users"></i>
            <span>{liveCounter.toLocaleString()}</span> volunteers online now
          </div>
          
          <h1>Welcome to Event Volunteer Tracker</h1>
          <p>Join us to manage and participate in events that make a difference in your community.</p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="btn-register btn-animate">Get Started</Link>
              <Link to="/events" className="btn-secondary btn-animate">Browse Events</Link>
            </div>
          )}
        </div>

        <div className="scroll-indicator animate-bounce">
          <span>Scroll Down</span>
          <div className="arrow"></div>
        </div>
      </header>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" data-count="5000">{stats.volunteers.toLocaleString()}+</div>
              <div className="stat-label">Volunteers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="250">{stats.events}+</div>
              <div className="stat-label">Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="10000">{stats.hours.toLocaleString()}+</div>
              <div className="stat-label">Hours Contributed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-count="50">{stats.communities}+</div>
              <div className="stat-label">Communities Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading" className="animate-slide-up">Our Features</h2>
          <p className="section-description animate-slide-up-delay">
            Everything you need to manage volunteers and events efficiently
          </p>
          <div className="features-grid">
            {/* Feature cards */}
            <div className="feature-card animate-zoom">
              <div className="feature-icon"><i className="fas fa-users"></i></div>
              <h3>Volunteer Management</h3>
              <p>Track volunteers, their skills, availability, and participation history.</p>
            </div>
            <div className="feature-card animate-zoom-delay">
              <div className="feature-icon"><i className="fas fa-calendar-alt"></i></div>
              <h3>Event Management</h3>
              <p>Create, organize, and manage events with our intuitive tools.</p>
            </div>
            <div className="feature-card animate-zoom-delay2">
              <div className="feature-icon"><i className="fas fa-chart-line"></i></div>
              <h3>Reports & Analytics</h3>
              <p>Gain insights with detailed reports and analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>Events Near You</h2>
          <p className="section-description">Discover volunteering opportunities in your community</p>
          
          <div className="map-container animate-on-scroll">
            <div className="map-placeholder">
              <i className="fas fa-map-marked-alt"></i>
              <p>Interactive Map Loading...</p>
              <div className="map-points">
                {eventLocations.map(location => (
                  <div 
                    key={location.id} 
                    className="map-point"
                    style={{
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`
                    }}
                  >
                    <div className="point-tooltip">
                      <h4>{location.name}</h4>
                      <p>{location.volunteers} volunteers needed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Image Section */}
      <section className="banner-image-section">
        <img 
          src="/video/banner.jpeg" 
          alt="Promotional Banner" 
          className="banner-image animate-banner-drop" 
        />
      </section>

      {/* Success Stories Section */}
      <section className="success-section">
        <div className="container">
          <h2 className="animate-slide-up">Success Stories</h2>
          <div className="success-grid">
            <div className="success-card animate-zoom">
              <div className="success-image-container">
                <img src="/images/story1.jpg" alt="Community Clean-Up Drive" />
                <div className="success-overlay">
                  <button className="btn-view-more">View Details</button>
                </div>
              </div>
              <h3>Community Clean-Up Drive</h3>
              <p>
                Over 200 volunteers helped clean local parks and streets,
                impacting thousands of residents.
              </p>
            </div>
            <div className="success-card animate-zoom-delay">
              <div className="success-image-container">
                <img src="/images/story2.jpg" alt="Food Distribution Program" />
                <div className="success-overlay">
                  <button className="btn-view-more">View Details</button>
                </div>
              </div>
              <h3>Food Distribution Program</h3>
              <p>500+ meals distributed to families in need across multiple neighborhoods.</p>
            </div>
            <div className="success-card animate-zoom-delay2">
              <div className="success-image-container">
                <img src="/images/story3.jpg" alt="Tree Plantation Event" />
                <div className="success-overlay">
                  <button className="btn-view-more">View Details</button>
                </div>
              </div>
              <h3>Tree Plantation Event</h3>
              <p>Planted over 1000 trees with local schools and community groups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Spotlight Section */}
      <section className="volunteer-spotlight">
        <div className="container">
          <h2>Volunteer Spotlight</h2>
          <p className="section-description">Meet some of our amazing volunteers making a difference</p>
          
          <div className="spotlight-carousel">
            {volunteerSpotlights.map(volunteer => (
              <div key={volunteer.id} className="spotlight-card animate-on-scroll">
                <div className="spotlight-image">
                  <img src={volunteer.image} alt={volunteer.name} />
                  <div className="volunteer-badges">
                    {volunteer.badges.map((badge, index) => (
                      <span key={index} className="badge">{badge}</span>
                    ))}
                  </div>
                </div>
                <div className="spotlight-content">
                  <h3>{volunteer.name}</h3>
                  <p className="volunteer-role">{volunteer.role}</p>
                  <p className="volunteer-quote">"{volunteer.quote}"</p>
                  <p className="volunteer-contributions">{volunteer.contributions}</p>
                  
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '85%'}}></div>
                    <span>85% impact score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step animate-on-scroll">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up</h3>
                <p>Create an account as an organizer or volunteer</p>
              </div>
            </div>
            <div className="step animate-on-scroll">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Find or Create Events</h3>
                <p>Browse events or create your own volunteering opportunities</p>
              </div>
            </div>
            <div className="step animate-on-scroll">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Make an Impact</h3>
                <p>Participate in events and track your contributions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Library Section */}
      <section className="resources-section">
        <div className="container">
          <h2>Resource Library</h2>
          <p className="section-description">Helpful resources for volunteers and organizers</p>
          
          <div className="resources-grid">
            {resources.map(resource => (
              <a key={resource.id} href={resource.link} className="resource-card animate-on-scroll">
                <div className="resource-icon">
                  <i className={resource.icon}></i>
                </div>
                <div className="resource-content">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                </div>
                <div className="resource-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Event Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2>Upcoming Events</h2>
          <p className="section-description">Join these upcoming community events</p>
          
          <div className="timeline">
            <div className="timeline-event animate-on-scroll">
              <div className="timeline-date">Aug 30, 2025</div>
              <div className="timeline-content">
                <h3>Beach Cleanup Day</h3>
                <p>Help clean up local beaches and promote marine conservation.</p>
                <span className="event-tag">Environment</span>
                <div className="event-meta">
                  <span><i className="fas fa-users"></i> 24 volunteers needed</span>
                  <span><i className="fas fa-map-marker-alt"></i> Santa Monica Beach</span>
                </div>
              </div>
            </div>
            <div className="timeline-event animate-on-scroll">
              <div className="timeline-date">Sep 5, 2025</div>
              <div className="timeline-content">
                <h3>Food Bank Assistance</h3>
                <p>Sort and package food donations for distribution to families in need.</p>
                <span className="event-tag">Hunger Relief</span>
                <div className="event-meta">
                  <span><i className="fas fa-users"></i> 18 volunteers needed</span>
                  <span><i className="fas fa-map-marker-alt"></i> Downtown Community Center</span>
                </div>
              </div>
            </div>
            <div className="timeline-event animate-on-scroll">
              <div className="timeline-date">Sep 12, 2025</div>
              <div className="timeline-content">
                <h3>Senior Tech Support</h3>
                <p>Help seniors learn to use technology to stay connected with loved ones.</p>
                <span className="event-tag">Education</span>
                <div className="event-meta">
                  <span><i className="fas fa-users"></i> 12 volunteers needed</span>
                  <span><i className="fas fa-map-marker-alt"></i> Senior Living Community</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="timeline-cta">
            <Link to="/VolunteerEvents" className="btn-register">View All Upcoming Events</Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section" aria-labelledby="testimonials-heading">
        <div className="container">
          <h2 id="testimonials-heading">What People Say</h2>
          <div className="testimonials-container">
            <div className="testimonial animate-on-scroll">
              <div className="testimonial-content">
                <i className="fas fa-quote-left"></i>
                <p>
                  This platform revolutionized how we manage our volunteer
                  programs. The tools saved us countless hours of administrative
                  work.
                </p>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-details">
                    <h4>Sarah Johnson</h4>
                    <p>Nonprofit Director</p>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial animate-on-scroll">
              <div className="testimonial-content">
                <i className="fas fa-quote-left"></i>
                <p>
                  As a volunteer, I love how easy it is to find opportunities
                  that match my skills and schedule. The tracking features are
                  fantastic!
                </p>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-details">
                    <h4>Michael Chen</h4>
                    <p>Volunteer</p>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star-half-alt"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Share Section */}
      <section className="social-section">
        <div className="container">
          <h2>Spread the Word</h2>
          <p className="section-description">Help us reach more volunteers by sharing with your network</p>
          
          <div className="social-buttons">
            <button className="social-btn facebook" onClick={() => shareOnSocialMedia('facebook')}>
              <i className="fab fa-facebook-f"></i>
              Share on Facebook
            </button>
            <button className="social-btn twitter" onClick={() => shareOnSocialMedia('twitter')}>
              <i className="fab fa-twitter"></i>
              Share on Twitter
            </button>
            <button className="social-btn linkedin" onClick={() => shareOnSocialMedia('linkedin')}>
              <i className="fab fa-linkedin-in"></i>
              Share on LinkedIn
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <p className="section-description">Find answers to common questions about our platform</p>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFAQ === index ? 'active' : ''} animate-on-scroll`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">
                    {activeFAQ === index ? <i className="fas fa-minus"></i> : <i className="fas fa-plus"></i>}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to receive updates on upcoming events and volunteer opportunities</p>
            
            {subscribed ? (
              <div className="newsletter-success">
                <i className="fas fa-check-circle"></i>
                <p>Thank you for subscribing!</p>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Make a Difference?</h2>
              <p>Join our community of volunteers and organizations making an impact</p>
              <div className="cta-buttons">
                <Link to="/" className="btn-register">Sign Up Now</Link>
                <Link to="/events" className="btn-secondary">Browse Events</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="website-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Event Volunteer Tracker</h3>
              <p>
                Connecting volunteers with opportunities to make a difference in
                their communities.
              </p>
            <div className="social-links">
  <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook"></i>
  </a>
  <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-twitter"></i>
  </a>
  <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram"></i>
  </a>
  <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin"></i>
  </a>
</div>

            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/admin">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/volunteers">Volunteers</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <ul className="contact-info">
                <li><i className="fas fa-envelope"></i> info@volunteertracker.com</li>
                <li><i className="fas fa-phone"></i> (555) 123-4567</li>
                <li><i className="fas fa-map-marker-alt"></i> 123 Volunteer St, City, Country</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Event Volunteer Tracker. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Website;
