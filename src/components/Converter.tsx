import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export function Converter() {
  const { t } = useLanguage();
  const [fromValue, setFromValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('grams');
  const [toUnit, setToUnit] = useState<string>('tael');

  const conversionRates = {
    grams: 1,
    tael: 37.5,
    ounce: 31.1035
  };

  const calculateConversion = () => {
    const gramsValue = fromValue * conversionRates[fromUnit as keyof typeof conversionRates];
    const result = gramsValue / conversionRates[toUnit as keyof typeof conversionRates];
    return result.toFixed(6);
  };

  return (
    <section id="converter" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent text-accent-foreground">
              {t('buyback.cta.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('converter.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('converter.subtitle')}
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* From */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    {t('converter.from')}
                  </Label>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      value={fromValue}
                      onChange={(e) => setFromValue(parseFloat(e.target.value) || 0)}
                      className="text-lg"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">{t('converter.grams')}</SelectItem>
                        <SelectItem value="tael">{t('converter.tael')}</SelectItem>
                        <SelectItem value="ounce">{t('converter.ounce')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* To */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    {t('converter.to')}
                  </Label>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-accent p-3 bg-accent/10 rounded-lg text-center">
                      {calculateConversion()}
                    </div>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">{t('converter.grams')}</SelectItem>
                        <SelectItem value="tael">{t('converter.tael')}</SelectItem>
                        <SelectItem value="ounce">{t('converter.ounce')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Quick Reference */}
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-semibold mb-4 text-center">Quick Reference:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-3 bg-muted/50 rounded">
                    {t('converter.ref1')}
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded">
                    {t('converter.ref2')}
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded">
                    {t('converter.ref3')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
