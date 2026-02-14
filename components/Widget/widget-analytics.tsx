import { BetaAnalyticsDataClient } from '@google-analytics/data'
import type { google } from '@google-analytics/data/build/protos/protos'
import dayjs from 'dayjs'

import WidgetAnalyticsChart from './widget-analytics-chart'

export default async function WidgetAnalytics() {
  const projectId = process.env.GOOGLE_ANAYLTICS_PROJECT_ID
  const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
  if (!projectId || !clientEmail || !privateKey || !propertyId) return null

  const analyticsDataClient = new BetaAnalyticsDataClient({
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/gm, '\n')
    }
  })

  const request: google.analytics.data.v1beta.IRunReportRequest = {
    property: `properties/${propertyId}`,
    orderBys: [{ dimension: { orderType: 'NUMERIC', dimensionName: 'date' } }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'screenPageViews' }],
    keepEmptyRows: false
  }

  const reports = await Promise.all([
    analyticsDataClient.runReport({
      ...request,
      dateRanges: [{ startDate: dayjs().add(-1, 'month').format('YYYY-MM-DD'), endDate: 'today' }]
    }),
    analyticsDataClient.runReport({
      ...request,
      dateRanges: [
        {
          startDate: dayjs().add(-2, 'month').format('YYYY-MM-DD'),
          endDate: dayjs().add(-1, 'month').format('YYYY-MM-DD')
        }
      ]
    }),
    analyticsDataClient.runReport({
      ...request,
      dateRanges: [{ startDate: '2015-08-14', endDate: 'today' }]
    })
  ]).catch(() => null)

  if (!reports) return null

  const [[latestPageViews], [lastMonthPageViews], [totalPageViews]] = reports
  const lastTotal = (lastMonthPageViews.rows ?? []).reduce((acc, cur) => {
    acc += Number(cur.metricValues?.[0]?.value ?? 0)
    return acc
  }, 0)
  const latestTotal = (latestPageViews.rows ?? []).reduce((acc, cur) => {
    acc += Number(cur.metricValues?.[0]?.value ?? 0)
    return acc
  }, 0)
  const total = (totalPageViews.rows ?? []).reduce((acc, cur) => {
    acc += Number(cur.metricValues?.[0]?.value ?? 0)
    return acc
  }, 0)
  const percent = lastTotal === 0 ? 0 : Number((((latestTotal - lastTotal) / lastTotal) * 100).toFixed(1))
  const list = (latestPageViews.rows ?? []).map((item) => ({
    date: dayjs(item.dimensionValues?.[0]?.value).format('M월 D일'),
    '방문자 수': item.metricValues?.[0]?.value ?? '0'
  }))

  if (list.length === 0 && total === 0) return null

  return <WidgetAnalyticsChart total={total} percent={percent} list={list} />
}
