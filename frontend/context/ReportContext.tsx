import React, { createContext, useContext, useState } from "react";

interface ReportContextProps {
  reportId: string | null;
  setReportId: (id: string) => void;
}

const ReportContext = createContext<ReportContextProps | undefined>(undefined);

export const useReportContext = (): ReportContextProps => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReportContext must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reportId, setReportId] = useState<string | null>(null);

  return (
    <ReportContext.Provider value={{ reportId, setReportId }}>
      {children}
    </ReportContext.Provider>
  );
};
