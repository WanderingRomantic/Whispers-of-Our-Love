# Whispers of What We Were

## Overview

This is a Flask-based web application that presents an interactive love story told through ten poetic chapters. The application combines literary content with user engagement features, allowing readers to experience a romantic narrative while contributing their own thoughts through comments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Flask
- **Styling**: Custom CSS with modern design patterns including gradients, animations, and responsive layouts
- **Fonts**: Google Fonts integration (Dancing Script for headings, Cormorant Garamond for body text)
- **Icons**: Font Awesome for UI elements
- **JavaScript**: Vanilla JavaScript for interactive features (music player, animations)

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy extension
- **Session Management**: Flask's built-in session handling with configurable secret keys
- **Middleware**: ProxyFix for handling reverse proxy headers

### Data Storage
- **Primary Database**: SQLite (default) with PostgreSQL support via environment configuration
- **ORM Pattern**: SQLAlchemy DeclarativeBase with model definitions
- **Connection Pooling**: Configured with pool recycling and ping checks for reliability

## Key Components

### Models
- **Comment Model**: Stores user feedback with fields for chapter_id, name, thought, and timestamp
- **Chapter Data**: Static dictionary containing chapter titles and poetic quotes (stored in application code)

### Routes and Views
- **Homepage**: Landing page with hero section and story preview
- **Chapters Index**: Grid view of all available chapters
- **Individual Chapter**: Detailed chapter view with navigation and comment functionality
- **Chapter Navigation**: Previous/next chapter routing with boundary handling

### Static Assets
- **CSS**: Modern styling with dark theme, gradients, and animated elements
- **JavaScript**: Music player functionality and interactive UI enhancements
- **Responsive Design**: Mobile-first approach with flexible layouts

### Content Management
- **Chapter System**: 10 predefined chapters with titles and quotes
- **Static Content**: Poetic content embedded in templates
- **User Comments**: Dynamic content storage and retrieval per chapter

## Data Flow

1. **Request Handling**: Flask routes process incoming requests
2. **Template Rendering**: Jinja2 templates combine static content with dynamic data
3. **Database Operations**: SQLAlchemy handles comment storage and retrieval
4. **Static Assets**: CSS and JavaScript files served directly by Flask
5. **Session Management**: User sessions maintained for flash messages and potential future features

## External Dependencies

### Python Packages
- **Flask**: Web framework and request handling
- **Flask-SQLAlchemy**: Database ORM integration
- **Werkzeug**: WSGI utilities and middleware

### Frontend Libraries
- **Google Fonts**: Typography (Dancing Script, Cormorant Garamond)
- **Font Awesome**: Icon library for UI elements
- **Browser APIs**: Audio API for background music functionality

### Optional Integrations
- **Database**: Environment-configurable database URL (SQLite default, PostgreSQL supported)
- **Audio Content**: Background music with fallback handling

## Deployment Strategy

### Environment Configuration
- **Database URL**: Configurable via `DATABASE_URL` environment variable
- **Session Secret**: Configurable via `SESSION_SECRET` environment variable with fallback
- **Debug Mode**: Enabled for development, should be disabled for production

### Application Startup
- **Multiple Entry Points**: Both `app.py` and `main.py` can serve as application entry points
- **Database Initialization**: Automatic table creation on startup
- **Port Configuration**: Runs on port 5000 with host binding to 0.0.0.0

### Production Considerations
- **Proxy Support**: ProxyFix middleware configured for reverse proxy deployment
- **Database Pooling**: Connection pool settings optimized for production use
- **Static File Serving**: Flask serves static files (consider CDN for production)
- **Error Handling**: Basic logging configured for debugging

### Scalability Notes
- **Database**: Current SQLite setup suitable for low-traffic; PostgreSQL recommended for production
- **Session Storage**: Uses Flask's default session storage; consider Redis for multi-instance deployments
- **Static Content**: Content is embedded in code; consider CMS integration for dynamic content management