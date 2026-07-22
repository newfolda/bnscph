import { redirect } from "next/navigation"
import AdminSignOutButton from "@/src/components/admin/AdminSignOutButton"
import { getSiteUrl } from "@/src/lib/siteUrl"
import { requireAdminUser } from "@/src/server/auth/requireAdminUser"

export const dynamic = "force-dynamic"

const SettingRow = ({ label, value }: { label: string; value: string }) => (
  <div className="border-b border-[var(--border)] py-4 last:border-b-0 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-6">
    <dt className="text-sm font-medium text-[var(--text-secondary)]">{label}</dt>
    <dd className="mt-1 break-words text-sm font-semibold text-[var(--text-primary)] sm:mt-0">{value}</dd>
  </div>
)

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_8px_20px_rgba(31,31,31,0.05)]">
    <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">{title}</h2>
    <dl className="mt-4">{children}</dl>
  </section>
)

export default async function SettingsPage() {
  let adminUser
  try {
    adminUser = await requireAdminUser()
  } catch {
    redirect("/admin/login")
  }

  const notificationsEnabled = Boolean(
    process.env.RESEND_API_KEY &&
    process.env.SELL_CAR_NOTIFICATION_EMAIL &&
    process.env.SELL_CAR_FROM_EMAIL,
  )

  return (
    <section aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Settings</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Current application configuration. Changes are not available in this view.</p>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <SettingsSection title="General">
          <SettingRow label="Company Name" value="Buy & Sell Cars Philippines" />
          <SettingRow label="Website URL" value={getSiteUrl()} />
          <SettingRow label="Contact Email" value={process.env.SELL_CAR_NOTIFICATION_EMAIL || "Not configured"} />
          <SettingRow label="Contact Phone" value="Not configured" />
        </SettingsSection>

        <SettingsSection title="Lead Management">
          <SettingRow label="Default lead status" value="New" />
          <SettingRow label="Enable email notifications" value={notificationsEnabled ? "Enabled" : "Disabled"} />
          <SettingRow label="Notification recipient" value={process.env.SELL_CAR_NOTIFICATION_EMAIL || "Not configured"} />
        </SettingsSection>

        <SettingsSection title="System">
          <SettingRow label="Deployment environment" value={process.env.NODE_ENV || "Not configured"} />
          <SettingRow label="Supabase Project URL" value={process.env.SUPABASE_URL || "Not configured"} />
          <SettingRow label="Site URL" value={getSiteUrl()} />
          <SettingRow label="Build timestamp" value={process.env.BUILD_TIMESTAMP || "Not available"} />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingRow label="Signed-in admin" value={adminUser.email} />
          <SettingRow label="Role" value={adminUser.role} />
          <div className="pt-5"><AdminSignOutButton /></div>
        </SettingsSection>
      </div>
    </section>
  )
}
