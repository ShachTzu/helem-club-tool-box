import { useTheme } from './helam-theme-provider.js';
import { HelamTheme } from './helam-theme.js';
import { TokenViewer } from '@bitdesign/sparks.sparks-theme';

function ViewTokens() {
  const theme = useTheme();

  return <TokenViewer theme={theme} />;
}

export const LightTheme = () => {
  return (
    <HelamTheme>
      <ViewTokens />
    </HelamTheme>
  );
};

export const DarkTheme = () => {
  return (
    <HelamTheme initialTheme="dark">
      <ViewTokens />
    </HelamTheme>
  );
};

export const HelamBrandBook = () => {
  return (
    <HelamTheme>
      <div style={{ padding: 32 }}>
        <div
          style={{
            background: 'var(--effects-gradients-primary)',
            color: 'var(--colors-text-inverse)',
            borderRadius: 'var(--borders-radius-large)',
            padding: '40px 32px',
            marginBottom: 32,
            boxShadow: 'var(--effects-shadows-header)',
          }}
        >
          <div
            style={{
              color: 'var(--colors-accent-default)',
              fontWeight: 'var(--typography-font-weight-bold)',
              fontSize: 14,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            הלם קלאב — שפת עיצוב
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 'var(--typography-sizes-heading-h1)',
              fontWeight: 'var(--typography-font-weight-extra-bold)',
            }}
          >
            עיצוב רגוע, נושם וברור
          </h1>
          <p style={{ marginTop: 12, fontSize: 'var(--typography-sizes-subhead)', opacity: 0.85 }}>
            פלטת צבעים, טיפוגרפיה ורווחים המבוססים על ספר המותג של קהילת הלם קלאב.
          </p>
        </div>

        <h2
          style={{
            fontSize: 'var(--typography-sizes-heading-h2)',
            color: 'var(--colors-primary-default)',
            marginBottom: 16,
          }}
        >
          פלטת צבעים
        </h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          {[
            { name: 'ראשי (נייבי)', varName: 'var(--colors-primary-default)' },
            { name: 'משני (פלדה)', varName: 'var(--colors-secondary-default)' },
            { name: 'הדגשה (ענבר)', varName: 'var(--colors-accent-default)' },
            { name: 'משטח', varName: 'var(--colors-surface-primary)' },
            { name: 'משטח משני', varName: 'var(--colors-surface-secondary)' },
          ].map((swatch) => (
            <div key={swatch.name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 'var(--borders-radius-medium)',
                  background: swatch.varName,
                  border: '1px solid var(--colors-border)',
                  boxShadow: 'var(--effects-shadows-card)',
                }}
              />
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--colors-text-secondary)' }}>
                {swatch.name}
              </div>
            </div>
          ))}
        </div>

        <h2
          style={{
            fontSize: 'var(--typography-sizes-heading-h2)',
            color: 'var(--colors-primary-default)',
            marginBottom: 16,
          }}
        >
          טיפוגרפיה
        </h2>
        <div
          style={{
            background: 'var(--colors-surface-primary)',
            border: '1px solid var(--colors-border)',
            borderRadius: 'var(--borders-radius-medium)',
            boxShadow: 'var(--effects-shadows-card)',
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 'var(--typography-sizes-heading-h1)',
              fontWeight: 'var(--typography-font-weight-extra-bold)',
              color: 'var(--colors-primary-default)',
            }}
          >
            כותרת H1 — 36 / extrabold
          </div>
          <div
            style={{
              fontSize: 'var(--typography-sizes-heading-h2)',
              fontWeight: 'var(--typography-font-weight-bold)',
              color: 'var(--colors-primary-default)',
              marginTop: 12,
            }}
          >
            כותרת H2 — 24
          </div>
          <div
            style={{
              fontSize: 'var(--typography-sizes-subhead)',
              fontWeight: 'var(--typography-font-weight-semi-bold)',
              color: 'var(--colors-secondary-default)',
              marginTop: 12,
            }}
          >
            כותרת משנה — 18 / semibold
          </div>
          <div style={{ fontSize: 'var(--typography-sizes-body-default)', marginTop: 12 }}>
            טקסט גוף — 14 עד 16 פיקסלים, לקריאה נוחה ורגועה בכל מסך.
          </div>
        </div>

        <h2
          style={{
            fontSize: 'var(--typography-sizes-heading-h2)',
            color: 'var(--colors-primary-default)',
            marginBottom: 16,
          }}
        >
          כרטיסים ורדיוסים
        </h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 200,
              padding: 20,
              background: 'var(--colors-surface-primary)',
              border: '1px solid var(--colors-border)',
              borderRadius: 'var(--borders-radius-small)',
              boxShadow: 'var(--effects-shadows-card)',
            }}
          >
            רדיוס קטן (8px)
          </div>
          <div
            style={{
              width: 200,
              padding: 20,
              background: 'var(--colors-surface-primary)',
              border: '1px solid var(--colors-border)',
              borderRadius: 'var(--borders-radius-medium)',
              boxShadow: 'var(--effects-shadows-card)',
            }}
          >
            רדיוס בינוני (14px)
          </div>
          <div
            style={{
              width: 200,
              padding: 20,
              background: 'var(--colors-surface-primary)',
              border: '1px solid var(--colors-border)',
              borderRadius: 'var(--borders-radius-large)',
              boxShadow: 'var(--effects-shadows-card)',
            }}
          >
            רדיוס גדול (22px)
          </div>
          <div
            style={{
              padding: '10px 24px',
              background: 'var(--colors-accent-default)',
              color: 'var(--colors-primary-default)',
              borderRadius: 'var(--borders-radius-pill)',
              fontWeight: 'var(--typography-font-weight-bold)',
              alignSelf: 'center',
            }}
          >
            כפתור פיל
          </div>
        </div>
      </div>
    </HelamTheme>
  );
};
