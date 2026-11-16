/**
 * Governorate <select> used inside a search field.
 * @param {{ name: string, label: string, cities: { id:number, name:string }[], value: number|string,
 *           onChange: (id: number) => void }} props
 */
export default function CitySelect({ name, label, cities, value, onChange }) {
  return (
    <select
      name={name}
      aria-label={label}
      required
      value={value ?? ''}
      onChange={(event) => onChange(Number(event.target.value))}
      className="mt-[11px] h-[30px] w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent p-0 text-[11px] font-black text-text outline-none focus-visible:outline-none max-sm:mt-2.5 max-xs:text-[10px]"
    >
      {cities.map((city) => (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ))}
    </select>
  )
}
