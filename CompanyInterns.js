import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, Filter } from "lucide-react";
import AppHeader from "@/components/AppHeader";

interface InternData {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  internshipPost: string;
  applicationDate: string;
  status: 'Accepted' | 'Rejected' | 'Pending' | 'Acceptance';
  lastEmailSent: string;
}

// Sample data
const sampleInterns: InternData[] = [
  {
    id: '1',
    name: 'Mina Gerges',
    phoneNumber: '+20 101 234 5678',
    email: 'mina.gerges@student.guc.edu.eg',
    internshipPost: 'Embedded Systems Intern',
    applicationDate: '4/1/2024',
    status: 'Accepted',
    lastEmailSent: 'Accepted',
  },
  {
    id: '2',
    name: 'Nourhan Tarek',
    phoneNumber: '+20 102 345 6789',
    email: 'nourhan.tarek@student.guc.edu.eg',
    internshipPost: 'Urban Planning Intern',
    applicationDate: '4/2/2024',
    status: 'Accepted',
    lastEmailSent: 'Acceptance',
  },
  {
    id: '3',
    name: 'Karim Fathy',
    phoneNumber: '+20 103 456 7890',
    email: 'karim.fathy@student.guc.edu.eg',
    internshipPost: 'Business Analyst Intern',
    applicationDate: '4/3/2024',
    status: 'Accepted',
    lastEmailSent: 'Accepted',
  },
  {
    id: '4',
    name: 'Dina Magdy',
    phoneNumber: '+20 104 567 8901',
    email: 'dina.magdy@student.guc.edu.eg',
    internshipPost: 'Pharmaceutical Research Intern',
    applicationDate: '4/4/2024',
    status: 'Rejected',
    lastEmailSent: 'Rejected',
  },
];

const CompanyInterns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter interns based on search query
  const filteredInterns = sampleInterns.filter(intern => 
    intern.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get the appropriate background color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a365d]">Interns Information</h1>
          <Button className="bg-[#1a365d] hover:bg-[#2d4a73]">
            Back to Internships
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              placeholder="Search by intern name..." 
              className="pl-10 border-gray-300" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={18} />
            Filter by
            <ChevronDown size={16} />
          </Button>
        </div>
        
        {/* Integrated Intern Table */}
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Student Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Phone Number</TableHead>
                <TableHead className="font-semibold text-gray-700">Email Address</TableHead>
                <TableHead className="font-semibold text-gray-700">Internship Post</TableHead>
                <TableHead className="font-semibold text-gray-700">Application Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Last Email Sent</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterns.map((intern) => (
                <TableRow key={intern.id} className="border-t hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-700">{intern.name}</TableCell>
                  <TableCell>{intern.phoneNumber}</TableCell>
                  <TableCell>{intern.email}</TableCell>
                  <TableCell>{intern.internshipPost}</TableCell>
                  <TableCell>{intern.applicationDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(intern.status)}`}>
                        {intern.status}
                      </span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell>{intern.lastEmailSent}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CompanyInterns;