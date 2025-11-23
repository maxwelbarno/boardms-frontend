'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import TodaysMeetings from './TodaysMeetings';

const UpcomingMeetings = () => {
  const { accessToken } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selector, setSelector] = useState<'all' | 'upcoming' | 'past'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/meetings', {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { meetings } = await response.json();

      setMeetings(meetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const filter = () => {
    const now = new Date();

    try {
      switch (selector) {
        case 'upcoming':
          return meetings.filter((meeting) => new Date(meeting.startAt) >= now);
        case 'past':
          return meetings.filter((meeting) => new Date(meeting.startAt) < now);
        default:
          return meetings;
      }
    } catch (error) {
      return [];
    }
  };

  const groupMeetingsByMonthYear = (meetingsArray: Meeting[]) => {
    if (!Array.isArray(meetingsArray)) {
      return {};
    }

    const grouped: GroupedMeetings = {};

    meetingsArray.forEach((meeting) => {
      try {
        const date = new Date(meeting.startAt);
        const monthYear = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        });

        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(meeting);
      } catch (error) {
        console.error('Error processing meeting date:', meeting.startAt, error);
      }
    });

    // Sort months chronologically
    return Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .reduce((acc, key) => {
        acc[key] = grouped[key].sort(
          (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        );
        return acc;
      }, {} as GroupedMeetings);
  };

  const getMeetingStatus = (startAt: string) => {
    try {
      const meetingDate = new Date(startAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const meetingDay = new Date(
        meetingDate.getFullYear(),
        meetingDate.getMonth(),
        meetingDate.getDate()
      );

      if (meetingDay.getTime() === today.getTime()) {
        return { label: 'Today', class: 'bg-green-500 text-white' };
      } else if (meetingDate < now) {
        return { label: 'Completed', class: 'bg-gray-500 text-white' };
      } else {
        return { label: 'Upcoming', class: 'bg-blue-500 text-white' };
      }
    } catch (error) {
      console.error('Error calculating meeting status:', error);
      return { label: 'Unknown', class: 'bg-gray-500 text-white' };
    }
  };

  const formatMeetingTime = (startAt: string) => {
    try {
      const date = new Date(startAt);
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      };
    } catch (error) {
      console.error('Error formatting meeting time:', error);
      return {
        date: 'Invalid Date',
        time: 'Invalid Time',
        day: '--',
        month: '---',
        weekday: '---',
      };
    }
  };

  const getNextOrCurrentMeeting = (meetingsArray: Meeting[]) => {
    if (!Array.isArray(meetingsArray) || meetingsArray.length === 0) return null;

    const now = new Date();
    const upcomingMeetings = meetingsArray.filter((meeting) => new Date(meeting.startAt) >= now);

    if (upcomingMeetings.length === 0) return null;

    // Return the earliest upcoming meeting
    return upcomingMeetings.sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  };

  const filteredMeetings = filter();

  const groupedMeetings = groupMeetingsByMonthYear(filteredMeetings);
  const nextMeeting = getNextOrCurrentMeeting(filteredMeetings);

  if (loading) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white'>Upcoming Meetings</h3>
        </div>
        <div className='p-6'>
          <div className='animate-pulse space-y-4'>
            {[1, 2, 3].map((n) => (
              <div key={n} className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
      {/* Header */}
      <Link href={`/meetings/${nextMeeting ? nextMeeting[0].id : ''}`}>
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <TodaysMeetings meetings={meetings} />
        </div>
      </Link>

      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>Cabinet Meetings</h3>

          {/* Filter Buttons */}
          <div className='flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
            <button
              onClick={() => setSelector('upcoming')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selector === 'upcoming'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setSelector('past')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selector === 'past'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setSelector('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selector === 'all'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className='flex gap-6 mt-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {Array.isArray(meetings)
                ? meetings.filter((m) => new Date(m.startAt) >= new Date()).length
                : 0}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Upcoming</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {Array.isArray(meetings)
                ? meetings.filter((m) => {
                    try {
                      const date = new Date(m.startAt);
                      const today = new Date();
                      return date.toDateString() === today.toDateString();
                    } catch {
                      return false;
                    }
                  }).length
                : 0}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Today</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-gray-700 dark:text-gray-300'>
              {Array.isArray(meetings) ? meetings.length : 0}
            </div>
            <div className='text-xs text-gray-600 dark:text-gray-400'>Total</div>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className='p-6 max-h-[600px] overflow-y-auto'>
        {!Array.isArray(meetings) || meetings.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 dark:text-gray-500 text-6xl mb-4'>📅</div>
            <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No meetings found
            </h4>
            <p className='text-gray-600 dark:text-gray-400'>
              {!Array.isArray(meetings)
                ? 'Error loading meetings'
                : selector === 'upcoming'
                  ? 'No upcoming meetings scheduled.'
                  : selector === 'past'
                    ? 'No past meetings found.'
                    : 'No meetings found.'}
            </p>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Next/Current Meeting - Featured Card */}
            {nextMeeting &&
              selector !== 'past' &&
              nextMeeting.map((meeting, index) => (
                <div className='mb-8' key={index}>
                  <h4 className='text-lg font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-500 pl-3'>
                    Next Meeting
                  </h4>
                  <Link href={`/meetings/${meeting.id}`}>
                    <div className='bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200'>
                      <div className='flex flex-col lg:flex-row gap-6'>
                        {/* Date Box */}
                        <div className='shrink-0'>
                          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center min-w-20'>
                            <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                              {formatMeetingTime(meeting.startAt).day}
                            </div>
                            <div className='text-sm font-medium text-gray-700 dark:text-gray-300 uppercase'>
                              {formatMeetingTime(meeting.startAt).month}
                            </div>
                            <div className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                              {formatMeetingTime(meeting.startAt).weekday}
                            </div>
                          </div>
                        </div>

                        {/* Meeting Details */}
                        <div className='flex-1'>
                          <div className='flex items-start justify-between mb-4'>
                            <h4 className='text-xl font-bold text-gray-900 dark:text-white'>
                              {meeting.name}
                            </h4>
                            <span className='px-3 py-1 text-sm font-bold bg-green-500 text-white rounded-full'>
                              {getMeetingStatus(meeting.startAt).label}
                            </span>
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center gap-4 flex-wrap'>
                              <div className='flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300'>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                  <path
                                    fillRule='evenodd'
                                    d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                <span>{formatMeetingTime(meeting.startAt).date}</span>
                              </div>
                              <div className='flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300'>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                  <path
                                    fillRule='evenodd'
                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                <span>{formatMeetingTime(meeting.startAt).time}</span>
                              </div>
                            </div>

                            <div className='flex items-center gap-4 flex-wrap'>
                              <div className='flex items-center gap-2 text-base text-gray-700 dark:text-gray-300'>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                  <path
                                    fillRule='evenodd'
                                    d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                <span className='font-medium'>{meeting.location}</span>
                              </div>
                            </div>

                            {meeting.description && (
                              <p className='text-gray-700 dark:text-gray-300 mt-3 leading-relaxed'>
                                {meeting.description}
                              </p>
                            )}
                          </div>

                          <div className='flex flex-wrap gap-2 mt-4'>
                            <span
                              className='px-3 py-1 text-sm font-bold text-white rounded-full'
                              style={{ backgroundColor: meeting.color || '#3B82F6' }}
                            >
                              {meeting.type}
                            </span>
                            {meeting.committee && (
                              <span className='px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'>
                                {meeting.committee.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

            {/* Other Meetings */}
            {Object.entries(groupedMeetings).map(([monthYear, monthMeetings]) => {
              // Filter out the next meeting from the regular list if it exists
              const regularMeetings = nextMeeting
                ? monthMeetings.filter((meeting) => meeting.id !== nextMeeting[0].id)
                : monthMeetings;

              if (regularMeetings.length === 0) return null;

              return (
                <div key={monthYear} className='space-y-4'>
                  {/* Month Header */}
                  <div className='sticky top-0 bg-white dark:bg-gray-800 py-2 z-10'>
                    <h4 className='text-lg font-bold text-gray-900 dark:text-white border-l-4 border-blue-500 pl-3'>
                      {monthYear}
                    </h4>
                  </div>

                  {/* Regular Meetings */}

                  <div className='space-y-4'>
                    {regularMeetings.map((meeting) => {
                      const { date, time, day, month, weekday } = formatMeetingTime(
                        meeting.startAt
                      );
                      const status = getMeetingStatus(meeting.startAt);

                      return (
                        <Link href={`/meetings/${meeting.id}`} key={meeting.id}>
                          <div
                            key={meeting.id}
                            className='group p-5 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 bg-white dark:bg-gray-800 hover:shadow-md'
                            style={{
                              borderLeftColor: meeting.color || '#3B82F6',
                              borderLeftWidth: '4px',
                            }}
                          >
                            <div className='flex flex-col lg:flex-row lg:items-start gap-4'>
                              {/* Date Box */}
                              <div className='shrink-0'>
                                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 text-center min-w-[70px]'>
                                  <div className='text-lg font-bold text-gray-900 dark:text-white'>
                                    {day}
                                  </div>
                                  <div className='text-sm font-medium text-gray-700 dark:text-gray-300 uppercase'>
                                    {month}
                                  </div>
                                  <div className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                                    {weekday}
                                  </div>
                                </div>
                              </div>

                              <div className='flex-1'>
                                <div className='flex items-start justify-between mb-3'>
                                  <h4 className='text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                                    {meeting.name}
                                  </h4>
                                  <span
                                    className={`px-3 py-1 text-xs font-bold rounded-full ${status.class}`}
                                  >
                                    {status.label}
                                  </span>
                                </div>

                                <div className='space-y-2'>
                                  <div className='flex items-center gap-3 flex-wrap'>
                                    <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                                      <svg
                                        className='w-4 h-4'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                                          clipRule='evenodd'
                                        />
                                      </svg>
                                      <span>{time}</span>
                                    </div>
                                    <div className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
                                    <div className='flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300'>
                                      <svg
                                        className='w-4 h-4'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                                          clipRule='evenodd'
                                        />
                                      </svg>
                                      <span className='font-medium'>{meeting.location}</span>
                                    </div>
                                  </div>

                                  {meeting.description && (
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2'>
                                      {meeting.description}
                                    </p>
                                  )}
                                </div>

                                <div className='flex flex-wrap gap-2 mt-3'>
                                  <span
                                    className='px-3 py-1 text-sm font-bold text-white rounded-full'
                                    style={{ backgroundColor: meeting.color || '#3B82F6' }}
                                  >
                                    {meeting.type}
                                  </span>
                                  {meeting.committee && (
                                    <span className='px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'>
                                      {meeting.committee.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
