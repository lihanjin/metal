import { Award, FlaskConical, Building2, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';

export function About() {
  const { t } = useLanguage();

  const refineries = [
    { name: 'PAMP', country: 'Switzerland' },
    { name: 'Heraeus', country: 'Germany' },
    { name: 'Metalor', country: 'Switzerland' },
    { name: 'Valcambi', country: 'Switzerland' }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('about.title')}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t('about.content')}
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                <Award className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bold mb-2">{t('about.licensed.title')}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {t('about.licensed.number')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('about.licensed.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                <FlaskConical className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bold mb-2">{t('about.xrf.title')}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {t('about.xrf.subtitle')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('about.xrf.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                <Building2 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bold mb-2">{t('about.certified.title')}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {t('about.certified.subtitle')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('about.certified.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                <FileText className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bold mb-2">{t('about.transparent.title')}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {t('about.transparent.subtitle')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('about.transparent.desc')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Compliance */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-center">
                {t('about.compliance.title')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.compliance.type')}:</span>
                  <span className="font-semibold">{t('about.compliance.typeValue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.compliance.reg')}:</span>
                  <span className="font-semibold">{t('about.compliance.regValue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.compliance.issued')}:</span>
                  <span className="font-semibold">{t('about.compliance.issuedValue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.compliance.status')}:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {t('about.compliance.statusValue')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-center">
                {t('about.equipment.title')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.equipment.tech')}:</span>
                  <span className="font-semibold">{t('about.equipment.techValue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.equipment.accuracy')}:</span>
                  <span className="font-semibold">{t('about.equipment.accuracyValue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.equipment.calibration')}:</span>
                  <span className="font-semibold">{t('about.equipment.calibrationValue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('about.equipment.method')}:</span>
                  <span className="font-semibold">{t('about.equipment.methodValue')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refineries */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-center">
                {t('about.refineries.title')}
              </h3>
              <div className="space-y-3">
                {refineries.map((refinery, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-semibold">{refinery.name}</span>
                    <span className="text-sm text-muted-foreground">{refinery.country}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
