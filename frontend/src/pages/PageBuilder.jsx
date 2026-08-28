import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/pages';

const SECTION_TEMPLATES = {
  hero: { type: 'hero', heading: 'Your Headline Here', subheading: 'Your subheading here' },
  form: { type: 'form', fields: ['name', 'email', 'phone'] },
  testimonial: { type: 'testimonial', quote: 'Customer quote here', author: 'Customer Name' },
  cta: { type: 'cta', buttonText: 'Click Here' },
  faq: { type: 'faq', question: 'Frequently asked question?', answer: 'The answer goes here.' }
};

const panelStyle = {
  backgroundColor: '#A1EAFB',
  borderRadius: '16px',
  border: '1px solid #FFCEF3'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: '10px',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #FFCEF3',
  backgroundColor: '#FDFDFD',
  color: '#2A2A2A',
  boxSizing: 'border-box',
  outline: 'none'
};

function PageBuilder() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const fetchPages = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const createPage = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, slug: newSlug })
      });
      const created = await res.json();
      setNewTitle('');
      setNewSlug('');
      await fetchPages();
      setCurrentPage(created);
    } catch (err) {
      console.error('Failed to create page:', err);
    }
  };

  const addSection = (type) => {
    if (!currentPage) return;
    const newSection = { ...SECTION_TEMPLATES[type] };
    const existingSections = currentPage.sections || [];
    setCurrentPage({ ...currentPage, sections: [...existingSections, newSection] });
  };

  const updateSectionField = (index, field, value) => {
    const updatedSections = [...currentPage.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setCurrentPage({ ...currentPage, sections: updatedSections });
  };

  const moveSection = (index, direction) => {
    const updatedSections = [...currentPage.sections];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updatedSections.length) return;
    [updatedSections[index], updatedSections[targetIndex]] =
      [updatedSections[targetIndex], updatedSections[index]];
    setCurrentPage({ ...currentPage, sections: updatedSections });
  };

  const removeSection = (index) => {
    const updatedSections = currentPage.sections.filter((_, i) => i !== index);
    setCurrentPage({ ...currentPage, sections: updatedSections });
  };

  const savePage = async () => {
    if (!currentPage?._id) return;
    try {
      await fetch(`${API_URL}/${currentPage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: currentPage.sections })
      });
      alert('Page saved!');
      fetchPages();
    } catch (err) {
      console.error('Failed to save page:', err);
    }
  };

  const actionButton = (label, onClick, key, color = '#CABBE9') => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHoveredBtn(key)}
      onMouseLeave={() => setHoveredBtn(null)}
      style={{
        padding: '8px 14px',
        marginRight: '8px',
        marginBottom: '8px',
        backgroundColor: hoveredBtn === key ? '#FFCEF3' : color,
        color: '#2A2A2A',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#FDFDFD',
      padding: '40px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      gap: '24px',
      fontFamily: 'sans-serif',
      color: '#2A2A2A'
    }}>

      {/* LEFT SIDEBAR */}
      <div style={{ ...panelStyle, width: '280px', padding: '20px', flexShrink: 0, height: 'fit-content' }}>
        <h3 style={{ marginTop: 0 }}>Your Pages</h3>
        <form onSubmit={createPage} style={{ marginBottom: '20px' }}>
          <input
            placeholder="Page title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="url-slug"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '8px 14px',
              backgroundColor: '#CABBE9',
              color: '#2A2A2A',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            + New Page
          </button>
        </form>

        {pages.map((page) => (
          <div
            key={page._id}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentPage?._id === page._id ? '#CABBE9' : '#FDFDFD',
              color: '#2A2A2A',
              border: '1px solid #FFCEF3'
            }}
          >
            <strong>{page.title}</strong>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              Visits: {page.visits || 0} | Submissions: {page.submissions || 0}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN EDITOR AREA */}
      <div style={{ ...panelStyle, flex: 1, padding: '24px' }}>
        {!currentPage ? (
          <p style={{ opacity: 0.6 }}>Select a page to edit, or create a new one.</p>
        ) : (
          <>
            <h2 style={{ marginTop: 0, color: '#2A2A2A' }}>Editing: {currentPage.title}</h2>
            <p style={{ fontSize: '14px', opacity: 0.85 }}>
              Public URL: <code style={{ color: '#2A2A2A', fontWeight: 'bold', backgroundColor: 'transparent' }}>http://localhost:5173/p/{currentPage.slug}</code>
            </p>

            <div style={{ margin: '16px 0' }}>
              {Object.keys(SECTION_TEMPLATES).map((type) =>
                actionButton(`+ Add ${type}`, () => addSection(type), `add-${type}`)
              )}
            </div>

            {(currentPage.sections || []).map((section, index) => (
              <div key={index} style={{
                backgroundColor: '#FDFDFD',
                border: '1px solid #FFCEF3',
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ textTransform: 'uppercase', fontSize: '13px', color: '#2A2A2A' }}>{section.type}</strong>
                  <div>
                    {actionButton('↑', () => moveSection(index, -1), `up-${index}`)}
                    {actionButton('↓', () => moveSection(index, 1), `down-${index}`)}
                    {actionButton('✕', () => removeSection(index), `remove-${index}`, '#FFCEF3')}
                  </div>
                </div>

                {section.type === 'hero' && (
                  <>
                    <input
                      value={section.heading || ''}
                      onChange={(e) => updateSectionField(index, 'heading', e.target.value)}
                      style={{ ...inputStyle, marginTop: '10px' }}
                    />
                    <input
                      value={section.subheading || ''}
                      onChange={(e) => updateSectionField(index, 'subheading', e.target.value)}
                      style={inputStyle}
                    />
                  </>
                )}

                {section.type === 'testimonial' && (
                  <>
                    <input
                      value={section.quote || ''}
                      onChange={(e) => updateSectionField(index, 'quote', e.target.value)}
                      style={{ ...inputStyle, marginTop: '10px' }}
                    />
                    <input
                      value={section.author || ''}
                      onChange={(e) => updateSectionField(index, 'author', e.target.value)}
                      style={inputStyle}
                    />
                  </>
                )}

                {section.type === 'cta' && (
                  <input
                    value={section.buttonText || ''}
                    onChange={(e) => updateSectionField(index, 'buttonText', e.target.value)}
                    style={{ ...inputStyle, marginTop: '10px' }}
                  />
                )}

                {section.type === 'faq' && (
                  <>
                    <input
                      value={section.question || ''}
                      onChange={(e) => updateSectionField(index, 'question', e.target.value)}
                      style={{ ...inputStyle, marginTop: '10px' }}
                    />
                    <input
                      value={section.answer || ''}
                      onChange={(e) => updateSectionField(index, 'answer', e.target.value)}
                      style={inputStyle}
                    />
                  </>
                )}

                {section.type === 'form' && (
                  <p style={{ opacity: 0.7, marginTop: '10px', fontSize: '13px', color: '#2A2A2A' }}>
                    Form fields: {(section.fields || []).join(', ')}
                  </p>
                )}
              </div>
            ))}

            {actionButton('Save Page', savePage, 'save', '#CABBE9')}
          </>
        )}
      </div>
    </div>
  );
}

export default PageBuilder;