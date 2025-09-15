export type EventStatus = "upcoming" | "past";
export interface EventItem {
id: string;
title: string;
date: string;
venue: string;
city: string;
img: string;
status: EventStatus;
ticketRef: string;
priceKES: number;
}
export interface UserProfile {
name: string;
username: string;
bio: string;
location: string;
avatarUrl?: string;
coverUrl?: string;
stats: { tickets: number; following: number; followers: number; walletKES: number };
notifyEmail: boolean;
notifyPush: boolean;
}