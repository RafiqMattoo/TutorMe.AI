import { useQuery } from '@tanstack/react-query'
import type React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen, Eye, Heart, MessageSquare, School, TrendingUp, Users } from 'lucide-react'
import { dashboardApi } from '../services'
import { PageHeader, StatCard } from '@/shared/components/ui'
import { formatDistanceToNow } from 'date-fns'
import { useAuthStore } from '@/shared/store/authStore'
import { roleProfiles } from '@/shared/auth/roles'

const COLORS = ['#14b8a6', '#2563eb', '#10b981', '#f59e0b', '#e11d48']

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)
  const profile = user?.role ? roleProfiles[user.role] : null
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 60_000,
  })

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
    </div>
  )

  const pieData = [
    { name: 'Students', value: stats?.totalStudents ?? 0 },
    { name: 'Teachers', value: stats?.totalTeachers ?? 0 },
    { name: 'Other', value: Math.max(0, (stats?.totalUsers ?? 0) - (stats?.totalStudents ?? 0) - (stats?.totalTeachers ?? 0)) },
  ]

  const articleData = [
    { name: 'Published', views: stats?.publishedArticles ?? 0 },
    { name: 'Draft', views: stats?.draftArticles ?? 0 },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={profile ? `${profile.label} view - ${profile.scope}` : 'Platform overview'} />

      <div className="space-y-6 p-5 lg:p-8">
        <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-2xl shadow-slate-300">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
            <div>
              <div className="text-xs font-bold uppercase text-teal-200">Today in StudyFetch</div>
              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-normal lg:text-5xl">
                {user?.firstName}, your {profile?.label ?? 'workspace'} is ready.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{profile?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-3xl font-black">{stats?.newUsersThisWeek ?? 0}</div>
                <div className="mt-1 text-xs text-white/55">new users this week</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-3xl font-black">{stats?.newArticlesThisWeek ?? 0}</div>
                <div className="mt-1 text-xs text-white/55">new study posts</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard title="Schools" value={stats?.totalSchools ?? 0} icon={School} color="teal" />
          <StatCard title="Users" value={stats?.totalUsers ?? 0} delta={`+${stats?.newUsersThisWeek ?? 0} this week`} icon={Users} color="blue" />
          <StatCard title="Study Posts" value={stats?.totalArticles ?? 0} delta={`+${stats?.newArticlesThisWeek ?? 0} this week`} icon={BookOpen} color="green" />
          <StatCard title="Total Views" value={stats?.totalViews ?? 0} icon={Eye} color="purple" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="card p-5 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800">Top Study Posts</h3>
              <TrendingUp size={18} className="text-teal-600" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={(stats?.topArticles?.length ? stats.topArticles : articleData).map(a => ({
                name: 'title' in a ? `${a.title.slice(0, 18)}...` : a.name,
                views: 'viewCount' in a ? a.viewCount : a.views,
                likes: 'likeCount' in a ? a.likeCount : 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#14b8a6" radius={[5, 5, 0, 0]} />
                <Bar dataKey="likes" fill="#2563eb" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="mb-4 text-sm font-black text-slate-800">People Mix</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={54} outerRadius={86} dataKey="value" labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              {pieData.map((item, i) => (
                <div key={item.name} className="rounded-lg bg-slate-50 p-2">
                  <div className="mx-auto mb-1 h-2 w-8 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <div className="font-bold text-slate-800">{item.value}</div>
                  <div className="text-slate-400">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-black text-slate-800">Engagement</h3>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              <Metric icon={Heart} label="Likes" value={stats?.totalLikes ?? 0} />
              <Metric icon={MessageSquare} label="Comments" value={stats?.totalComments ?? 0} />
              <Metric icon={BookOpen} label="Published" value={stats?.publishedArticles ?? 0} />
            </div>
          </div>

          <div className="card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-black text-slate-800">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {stats?.recentActivity?.slice(0, 5).map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-700">{a.description}</div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {a.userName && <>{a.userName} - </>}
                      {formatDistanceToNow(new Date(a.occurredAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="p-5">
      <Icon size={18} className="mb-3 text-teal-600" />
      <div className="text-2xl font-black text-slate-950">{value.toLocaleString()}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  )
}
