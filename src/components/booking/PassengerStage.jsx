import { Users } from 'lucide-react'
import InfoNote from '@/components/ui/InfoNote'
import PassengerCard from './PassengerCard'
import StageHead from './StageHead'

/**
 * Step 2: one card per selected seat (reference `passengerStage()`).
 * @param {{ seats: number[], passengers: object[], errors: object[], onChange: (i, field, value) => void,
 *           registerRef: (i, field, el) => void }} props
 */
export default function PassengerStage({ seats, passengers, errors, onChange, registerRef }) {
  return (
    <>
      <StageHead title="مين مسافر معنا؟" icon={Users} text="دخل بيانات المسافرين حسب عدد المقاعد المختارة." />
      <div>
        {passengers.map((passenger, i) => (
          <PassengerCard
            key={i}
            index={i}
            seat={seats[i]}
            value={passenger}
            errors={errors[i]}
            onChange={(field, value) => onChange(i, field, value)}
            registerRef={(field, el) => registerRef(i, field, el)}
          />
        ))}
      </div>
      <InfoNote variant="soft">هذه بيانات تجريبية فقط. لا تدخل معلوماتك الحساسة في نسخة التدريب.</InfoNote>
    </>
  )
}
