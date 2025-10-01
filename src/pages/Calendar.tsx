import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

interface CalendarEvent {
  title: string;
  description?: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({});
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("calendar_events");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar_events", JSON.stringify(events));
  }, [events]);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const addEvent = () => {
    if (!eventTitle.trim()) return;
    
    const newEvent = { title: eventTitle, description: eventDescription };
    setEvents({
      ...events,
      [selectedDate]: [...(events[selectedDate] || []), newEvent]
    });
    
    setShowDialog(false);
    setEventTitle("");
    setEventDescription("");
    toast.success("Event added");
  };

  const deleteEvent = (date: string, index: number) => {
    const updated = { ...events };
    updated[date].splice(index, 1);
    if (updated[date].length === 0) delete updated[date];
    setEvents(updated);
    toast.success("Event deleted");
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const days = [];
  
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[100px]" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = formatDate(date);
    const isToday = formatDate(new Date()) === dateStr;
    const dayEvents = events[dateStr] || [];
    
    days.push(
      <div
        key={day}
        className={`min-h-[100px] border rounded-lg p-2 ${isToday ? "bg-primary/10 border-primary" : "bg-card hover:bg-muted/50"} transition-colors cursor-pointer relative`}
        onClick={() => {
          setSelectedDate(dateStr);
          setShowDialog(true);
        }}
      >
        <div className="absolute top-2 left-2">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className={`text-right font-medium ${isToday ? "text-primary" : ""}`}>{day}</div>
        <div className="mt-1 space-y-1">
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              className="text-xs bg-secondary/80 text-secondary-foreground px-2 py-1 rounded truncate"
              onClick={(e) => e.stopPropagation()}
              title={event.description || event.title}
            >
              {event.title}
              <button
                className="ml-1 hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); deleteEvent(dateStr, idx); }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">TimeTamer</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[180px] text-center font-semibold">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {days}
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event - {selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Event description (optional)"
              />
            </div>
            <Button onClick={addEvent} className="w-full">Add Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
