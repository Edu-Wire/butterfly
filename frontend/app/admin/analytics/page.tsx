import { TrendingUp, TrendingDown, Users, Eye, ShoppingCart, DollarSign } from 'lucide-react'

const metrics = [
  {
    label: 'Page Views',
    value: '45,231',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
  },
  {
    label: 'Unique Visitors',
    value: '12,834',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Conversion Rate',
    value: '3.2%',
    change: '+0.8%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    label: 'Average Order Value',
    value: '$847.50',
    change: '+5.3%',
    trend: 'up',
    icon: DollarSign,
  },
]

const trafficBySource = [
  { source: 'Organic Search', visitors: 8245, percentage: 48 },
  { source: 'Direct', visitors: 4521, percentage: 26 },
  { source: 'Social Media', visitors: 3412, percentage: 20 },
  { source: 'Email', visitors: 856, percentage: 5 },
  { source: 'Referral', visitors: 428, percentage: 1 },
]

const topPages = [
  { path: '/shop', views: 4523, avgTime: '2:34', bounceRate: '32%' },
  { path: '/product/1', views: 3421, avgTime: '3:12', bounceRate: '28%' },
  { path: '/collection', views: 2847, avgTime: '1:45', bounceRate: '42%' },
  { path: '/lookbook', views: 2134, avgTime: '4:28', bounceRate: '18%' },
  { path: '/', views: 1956, avgTime: '1:23', bounceRate: '38%' },
]

export default function AdminAnalyticsPage() {
  return (
    <main className="flex-1">
      {/* Header */}
      <div className="bg-secondary border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:ml-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-primary">
                Analytics
              </h1>
              <p className="text-foreground/60 text-sm mt-1">
                Track your store's performance and customer behavior
              </p>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
            return (
              <div
                key={metric.label}
                className="bg-background border border-border rounded-sm p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60 text-sm font-medium">
                    {metric.label}
                  </span>
                  <div className="p-2 bg-secondary rounded-sm text-primary">
                    <Icon size={20} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {metric.value}
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendIcon size={12} />
                    {metric.change} from last period
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Traffic Sources & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Traffic Sources */}
          <div className="bg-background border border-border rounded-sm p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-foreground text-lg">
                Traffic Sources
              </h2>
              <p className="text-foreground/60 text-sm">
                Where your visitors come from
              </p>
            </div>

            <div className="space-y-4">
              {trafficBySource.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {source.source}
                    </span>
                    <span className="text-foreground/60">
                      {source.visitors.toLocaleString()} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-background border border-border rounded-sm p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-foreground text-lg">
                Top Pages
              </h2>
              <p className="text-foreground/60 text-sm">
                Most visited pages
              </p>
            </div>

            <div className="space-y-3">
              {topPages.map((page) => (
                <div
                  key={page.path}
                  className="p-3 bg-secondary rounded-sm space-y-2"
                >
                  <div className="flex justify-between">
                    <p className="font-medium text-foreground text-sm">
                      {page.path}
                    </p>
                    <p className="text-primary font-semibold">
                      {page.views.toLocaleString()} views
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/60">
                    <span>Avg. Time: {page.avgTime}</span>
                    <span>Bounce Rate: {page.bounceRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Funnel */}
        <div className="bg-background border border-border rounded-sm p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-foreground text-lg">
              Conversion Funnel
            </h2>
            <p className="text-foreground/60 text-sm">
              Customer journey from visit to purchase
            </p>
          </div>

          <div className="space-y-4">
            {[
              { step: 'Visitors', count: 45231, rate: '100%' },
              { step: 'Browsed Products', count: 23456, rate: '52%' },
              { step: 'Added to Cart', count: 8945, rate: '20%' },
              { step: 'Initiated Checkout', count: 5123, rate: '11%' },
              { step: 'Completed Purchase', count: 1447, rate: '3.2%' },
            ].map((funnel) => (
              <div key={funnel.step}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-foreground">
                    {funnel.step}
                  </span>
                  <span className="text-foreground/60 text-sm">
                    {funnel.count.toLocaleString()} ({funnel.rate})
                  </span>
                </div>
                <div className="h-8 bg-gradient-to-r from-primary/20 to-primary/60 rounded-sm flex items-center px-4">
                  <div
                    className="h-full bg-primary rounded-sm transition-all"
                    style={{ width: funnel.rate }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
