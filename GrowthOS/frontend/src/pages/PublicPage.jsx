import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/pages';

function getSlugFromURL() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1];
}

function PublicPage() {
  const [page, setPage] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const slug = getSlugFromURL();
    fetch(`${API_URL}/public/${slug}`)
      .then((res) => res.json())
      .then((data) => setPage(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = getSlugFromURL();
    await fetch(`${API_URL}/public/${slug}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setSubmitted(true);
  };

  if (!page) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FDFDFD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#2A2A2A'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#FDFDFD',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      color: '#2A2A2A'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {page.sections.map((section, index) => {

          if (section.type === 'hero') {
            return (
              <div key={index} style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#A1EAFB',
                borderRadius: '16px',
                border: '1px solid #FFCEF3',
                marginBottom: '20px'
              }}>
                <h1 style={{ 
                  margin: '0 0 12px 0', 
                  color: '#2A2A2A', 
                  fontSize: '32px', 
                  lineHeight: '1.2' 
                }}>
                  {section.heading}
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#2A2A2A', 
                  opacity: 0.85, 
                  margin: 0, 
                  lineHeight: '1.5' 
                }}>
                  {section.subheading}
                </p>
              </div>
            );
          }

          if (section.type === 'testimonial') {
            return (
              <div key={index} style={{
                padding: '24px',
                backgroundColor: '#A1EAFB',
                border: '1px solid #FFCEF3',
                borderRadius: '12px',
                margin: '20px 0'
              }}>
                <p style={{ 
                  fontStyle: 'italic', 
                  margin: 0, 
                  color: '#2A2A2A', 
                  lineHeight: '1.5' 
                }}>
                  "{section.quote}"
                </p>
                <p style={{ 
                  textAlign: 'right', 
                  color: '#2A2A2A', 
                  marginTop: '12px', 
                  marginBottom: 0, 
                  fontWeight: 'bold' 
                }}>
                  — {section.author}
                </p>
              </div>
            );
          }

          if (section.type === 'faq') {
            return (
              <div key={index} style={{
                padding: '16px 20px',
                backgroundColor: '#A1EAFB',
                borderRadius: '10px',
                margin: '12px 0',
                border: '1px solid #FFCEF3'
              }}>
                <strong style={{ color: '#2A2A2A', display: 'block', lineHeight: '1.3' }}>
                  {section.question}
                </strong>
                <p style={{ 
                  margin: '8px 0 0 0', 
                  color: '#2A2A2A', 
                  opacity: 0.9, 
                  lineHeight: '1.4' 
                }}>
                  {section.answer}
                </p>
              </div>
            );
          }

          if (section.type === 'cta') {
            return (
              <div key={index} style={{ textAlign: 'center', margin: '30px 0' }}>
                <button style={{
                  padding: '14px 40px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#CABBE9',
                  color: '#2A2A2A',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  {section.buttonText}
                </button>
              </div>
            );
          }

          if (section.type === 'form') {
            if (submitted) {
              return (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: '30px',
                  backgroundColor: '#A1EAFB',
                  borderRadius: '12px',
                  color: '#2A2A2A',
                  border: '1px solid #FFCEF3',
                  fontWeight: 'bold'
                }}>
                  Thanks! We'll be in touch.
                </div>
              );
            }
            return (
              <form key={index} onSubmit={handleSubmit} style={{
                padding: '24px',
                backgroundColor: '#A1EAFB',
                borderRadius: '16px',
                border: '1px solid #FFCEF3'
              }}>
                {section.fields.map((fieldName) => (
                  <input
                    key={fieldName}
                    placeholder={fieldName}
                    onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginBottom: '12px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #FFCEF3',
                      backgroundColor: '#FDFDFD',
                      color: '#2A2A2A',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                ))}
                <button
                  type="submit"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: hovered ? '#FFCEF3' : '#CABBE9',
                    color: '#2A2A2A',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transform: hovered ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Submit
                </button>
              </form>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default PublicPage;