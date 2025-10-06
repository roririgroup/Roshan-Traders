import React from "react";
import Button from '../../components/ui/Button';
import Badge from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash } from "lucide-react"; // 👈 icons

const AgentCard = ({ agent, onEdit, onRemove }) => {
  const navigate = useNavigate();
  const { id, name, referrals, image, location, joinDate, status } = agent;

  const handleImageError = (e) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop";
  };

  return (
    <Card className="p-4 border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                image ||
                "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop"
              }
              alt={`${name} profile`}
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
              onError={handleImageError}
              loading="lazy"
            />
            <div
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
              aria-label={`Status: ${status}`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{location}</span>
              <Badge
                variant={
                  referrals > 10
                    ? "success"
                    : referrals > 5
                    ? "warning"
                    : "default"
                }
              >
                {referrals} referrals
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">Joined {joinDate}</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/agents/${id}`)}
            className="flex items-center gap-1 text-xs"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(agent)}
            className="flex items-center gap-1 text-xs"
          >
            <Pencil className="h-4 w-4" />
          </Button>
         <Button
  variant="outline"   // 👈 outline keeps background white so icon is visible
  size="sm"
  onClick={() => onRemove(id)}
  className="flex items-center gap-1 text-xs"
>
  <Trash className="h-4 w-4"/> 
</Button>

        </div>
      </div>
    </Card>
  );
};

export default AgentCard;
