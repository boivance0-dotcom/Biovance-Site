import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import SearchSettingsForm from './SearchSettingsForm';

export const SettingsSheet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl bg-black/80 text-white border-white/20">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription className="text-white/70">
            Configure your search preferences and defaults.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <SearchSettingsForm />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;