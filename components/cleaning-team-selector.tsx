/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
/* Don't modify beyond what is requested ever. */
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Clock, Users, ThumbsUp, Award, Shield } from "lucide-react"

interface CleaningTeam {
  id: string
  name: string
  rating: number
  reviews: number
  experience: string
  specialties: string[]
  nextAvailable: string
  image: string
  premium?: boolean
}

interface CleaningTeamSelectorProps {
  onTeamSelect: (teamId: string) => void
  selectedTeam?: string
}

export function CleaningTeamSelector({ onTeamSelect, selectedTeam }: CleaningTeamSelectorProps) {
  const [selected, setSelected] = useState(selectedTeam || "")

  const teams: CleaningTeam[] = [
    {
      id: "team1",
      name: "The Sparkle Squad",
      rating: 4.9,
      reviews: 127,
      experience: "5+ years",
      specialties: ["Deep Cleaning", "Move-in/Move-out"],
      nextAvailable: "Tomorrow",
      image: "/professional-cleaning-team.png",
      premium: true,
    },
    {
      id: "team2",
      name: "Clean & Clear Crew",
      rating: 4.7,
      reviews: 98,
      experience: "3+ years",
      specialties: ["Pet-Friendly", "Eco-Friendly"],
      nextAvailable: "Today",
      image: "/placeholder-n09pw.png",
    },
    {
      id: "team3",
      name: "Pristine Professionals",
      rating: 4.8,
      reviews: 112,
      experience: "7+ years",
      specialties: ["Commercial", "Residential"],
      nextAvailable: "In 2 days",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const handleTeamSelect = (teamId: string) => {
    setSelected(teamId)
    onTeamSelect(teamId)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Select Your Cleaning Team
        </CardTitle>
        <CardDescription>Choose the team that best fits your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selected} onValueChange={handleTeamSelect} className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="relative">
              <RadioGroupItem value={team.id} id={team.id} className="peer sr-only" />
              <Label
                htmlFor={team.id}
                className="flex flex-col sm:flex-row items-start p-4 border-2 rounded-lg border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex items-center sm:mr-4 mb-4 sm:mb-0">
                  <Avatar className="h-16 w-16 border-2 border-gray-200">
                    <AvatarImage src={team.image || "/placeholder.svg"} alt={team.name} />
                    <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{team.name}</h3>
                      {team.premium && (
                        <Badge variant="default" className="ml-2">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1 sm:mt-0">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{team.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 ml-1">({team.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{team.experience} experience</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Available: {team.nextAvailable}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ThumbsUp className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Specialties: {team.specialties.join(", ")}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Background checked</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {team.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                    <Badge variant="outline">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm">
            View All Teams
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
