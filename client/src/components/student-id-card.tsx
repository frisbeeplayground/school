import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { QRCode } from "./qr-code";
import { GraduationCap } from "lucide-react";
import type { Student } from "@shared/schema";

interface StudentIdCardProps {
  student: Student;
  schoolName?: string;
  portalUrl?: string;
}

export function StudentIdCard({ student, schoolName = "School CMS", portalUrl }: StudentIdCardProps) {
  const qrValue = portalUrl || `${window.location.origin}/portal/${student.id}`;

  return (
    <Card className="w-[350px] overflow-hidden" data-testid={`id-card-${student.id}`}>
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{schoolName}</h3>
            <p className="text-xs opacity-80">Student Identity Card</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {student.firstName[0]}
                {student.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <h4 className="font-bold text-lg leading-tight">
              {student.firstName} {student.lastName}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              ID: <span className="font-mono">{student.studentId}</span>
            </p>
            {student.bloodGroup && (
              <p className="text-xs text-muted-foreground mt-1">
                Blood Group: <span className="font-medium">{student.bloodGroup}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <QRCode value={qrValue} size={90} />
            <p className="text-[10px] text-muted-foreground text-center">
              Scan for<br />Progress Portal
            </p>
          </div>
        </div>
      </CardContent>
      <div className="border-t px-4 py-2 bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center">
          If found, please return to {schoolName}
        </p>
      </div>
    </Card>
  );
}

export function StudentIdCardPrintable({ student, schoolName = "School CMS", portalUrl }: StudentIdCardProps) {
  const qrValue = portalUrl || `${window.location.origin}/portal/${student.id}`;

  return (
    <div
      className="w-[86mm] h-[54mm] bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm print:shadow-none print:border-gray-400"
      style={{ pageBreakInside: "avoid" }}
    >
      <div className="bg-blue-600 text-white px-3 py-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          <div>
            <h3 className="font-bold text-xs">{schoolName}</h3>
            <p className="text-[9px] opacity-80">Student ID Card</p>
          </div>
        </div>
      </div>
      <div className="p-2.5 flex gap-3">
        <div className="flex-1">
          <div className="w-14 h-14 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg mb-1.5">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <h4 className="font-bold text-sm leading-tight text-gray-900">
            {student.firstName} {student.lastName}
          </h4>
          <p className="text-[10px] text-gray-600 mt-0.5">
            ID: <span className="font-mono">{student.studentId}</span>
          </p>
          {student.bloodGroup && (
            <p className="text-[9px] text-gray-500">
              Blood: {student.bloodGroup}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white p-0.5">
            <QRCode value={qrValue} size={65} level="H" />
          </div>
          <p className="text-[8px] text-gray-500 text-center mt-0.5">
            Scan for Progress
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 px-2 py-1 bg-gray-50">
        <p className="text-[8px] text-gray-500 text-center">
          If found, return to {schoolName}
        </p>
      </div>
    </div>
  );
}
