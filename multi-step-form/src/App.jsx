import React, { useState, useMemo } from 'react'
import arcade from './assets/images/icon-arcade.svg'
import pro from './assets/images/icon-pro.svg'
import advanced from './assets/images/icon-advanced.svg'
// import checkmark from './assets/images/icon-checkmark.svg'
import thanks from './assets/images/icon-thank-you.svg'

function App() {
  
  const [active, setActive] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState([1, 1, 1])
  const [planErr, setPlanErr] = useState(false)
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    plan: {name: '', subscription: 'monthly'}, // default subscription is monthly
    addons: [],
  })

  const items = {
    'your info': ['Personal info', 'Please provide your name, email address and phone number.'],
    'select plan': ['Select your plan', 'You have the option of monthly or yearly billing.'],
    'add-ons': ['Pick add-ons', 'Add-ons help enhance your gaming experience.'],
    'summary': ['Finishing up', 'Double-check everything looks OK before confirming.']
  }
  const plans = {'arcade': 90, 'advanced': 120, 'pro': 150}
  const personalInfo = [
    {
      id: 1,
      name: 'name',
      label: 'name',
      placeholder: 'e.g. Stephen King',
    },
    {
      id: 2,
      name: 'email',
      label: 'email address',
      placeholder: 'e.g. stephenking@gmail.com',
    },
    {
      id: 3,
      name: 'phone',
      label: 'phone number',
      placeholder: 'e.g. +1 234 567 890',
    }
  ]

  const addOns = [
    {head: 'Online service', liner: 'Access to multiplayer games', cost: 1},
    {head: 'Larger storage', liner: 'Extra ITB of cloud save', cost: 2},
    {head: 'Customizable profile', liner: 'Custom theme on your profile', cost: 2},
  ]

  const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const validateEmail = () => {
    if (!user.email.match(validEmail)) return false // i.e. invalid
    else return true // valid
  }


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value})
  }

  const handleNext = () => {
    // check that personal info is all filled in
    if (active === 0 && (user.name.length === 0 || user.email.length === 0 || user.phone.length === 0)){
      setError(['name', 'email', 'phone'].map(item => user[item].length))
    } else if (active === 0 && !validateEmail()) {
      setError([1, false, 1]);
    } else {
      setError([1, 1, 1]);
      const isErr = active === 0 ? false : active === 1 && user.plan.name.length === 0 || active === 2 && user.addons.length === 0
      if (isErr){
        setPlanErr(true)
      } else {
        setPlanErr(false)
        if (active < 3) setActive(active + 1);
      }

    }
  }

  const handleCheck = (value) => {
    if (user.addons.includes(value)) setUser({ ...user, addons: user.addons.filter(val => val !== value) })
    else setUser({ ...user, addons: [...user.addons, value]})
  }

  const addOnsCost = useMemo(() => {
    let cost = 0 
    user.addons.map(adOn => {
      const theOne = addOns.find(add => add.head === adOn)
      const theCost = user.plan.subscription === 'monthly' ? theOne.cost : theOne.cost * 10
      cost = cost + theCost
      // console.log({ theCost })
    })
    return cost
  }, [user.addons, user.plan])

  // console.log({ addOnsCost })

  return (
   <div className="flex justify-center md:items-center md:p-8 gap-8 md:pt-10 md:pb-4 font-display max-w-[1440px] min-h-screen bg-Magnolia relative">
    <div className="flex flex-col md:flex-row md:w-[850px] w-full md:min-h-[500px] h-full gap-2 md:p-4 md:bg-White rounded-none md:rounded-lg">
      {/* Sidebar */}
      <div className="flex flex-row justify-center items-start md:justify-start md:items-start md:flex-col
        gap-6 pt-8 pb-20 md:pb-8 md:p-8 md:pr-20 bg-sidebarMobile md:bg-sidebarDesktop bg-cover md:rounded-md md:min-w-[250px]">
        {/* item */}
        {Object.keys(items)?.map((item, i) =>
          <div key={item} className="flex items-center gap-4">
            <span className={`${active === i ? 'bg-LightBlue text-MarineBlue' : 'border border-LightGray text-Alabaster'} rounded-full h-7 w-7 flex items-center justify-center font-bold text-xs`}>{i + 1}</span>
            <div className="hidden md:flex flex-col uppercase text-xs">
              <span className="text-CoolGray">Step {i + 1}</span>
              <span className="text-Alabaster font-bold">{item}</span>
            </div>
         </div>
          )}
      </div>
      {/* Form */}
      {!submitted ?
        <>
        <form onSubmit={(e) => {e.preventDefault(); setSubmitted(true)}} className="m-4 -mt-16 mb-32 md:m-0 bg-White md:bg-transparent rounded-md md:rounded-0 flex-1 flex flex-col gap-8 p-5 md:p-8 md:pl-24 md:pr-16 md:min-h-[500px]">
        {/* header */}
        <div className="flex flex-col gap-2">
          <span className="text-2xl md:text-3xl font-bold text-MarineBlue">{items[Object.keys(items)[active]][0]}</span>
          <span className="text-CoolGray font-display text-sm font-medium">{items[Object.keys(items)[active]][1]}</span>
        </div>
        {/* inputs */}
        {active === 0 ?
        <div className="flex flex-col gap-4">
          {personalInfo.map((item, i) =>
            <div key={item.id} className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label htmlFor={item.name} className="capitalize text-MarineBlue font-medium md:font-semibold text-xs md:text-sm">{item.label}</label>
                <span className={`${error[i] === 0 || error[i] === false ? 'flex' : 'hidden'} text-StrawberryRed font-semibold text-xs md:text-sm`}>{error[i] === 0 ? 'This field is required' : 'Enter a valid email address'}</span>
              </div>
              <input
                type="text"
                name={item.name}
                value={user[item.name]}
                onChange={handleChange}
                placeholder={item.placeholder}
                required
                className={`border ${error[i] === 0 ? 'border-StrawberryRed' : 'border-LightGray'} rounded-md p-4 py-2 md:py-3 text-MarineBlue font-semibold md:text-sm
                  text-xs focus:outline-none focus:border-PurplishBlue cursor-pointer`}
              />
            </div>
            )}
        </div>
        : active === 1 ?
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* item */}
            {['arcade', 'advanced', 'pro'].map(plan => 
              <div key={plan} className={`flex md:flex-col gap-4 md:gap-8 border rounded-md p-3 pr-8 ${user.plan.name === plan ? 'border-PurplishBlue bg-Magnolia' : 'border-LightGray'}
                transition-colors hover:border-PurplishBlue w-full cursor-pointer`} onClick={() => setUser({ ...user, plan: {...user.plan, name: plan}})}>
                <span className=""><img src={plan === 'arcade' ? arcade : plan === 'pro' ? pro : advanced} alt="item" className="h-9" /></span>
                <div className="flex flex-col md:gap-1">
                  <span className="capitalize text-MarineBlue font-semibold text-sm md:text-md">{plan}</span>
                  <span className="text-CoolGray text-xs md:text-sm">{user.plan.subscription === 'monthly' ? `$${plans[plan] / 10}/mo` : `$${plans[plan]}/yr`}</span>
                  {user.plan.subscription === 'yearly' && <span className="text-xs text-MarineBlue font-medium">2 months free</span>}
                </div>
              </div>
              )}
          </div>
          {planErr && user.plan.name.length === 0 && <span className="text-StrawberryRed text-xs md:text-sm">Please select a plan</span>}
          <div className="flex gap-4 justify-center items-center p-3 bg-Magnolia rounded-md text-xs md:text-sm font-semibold">
            <span className={`${user.plan?.subscription === 'monthly' ? 'text-MarineBlue' : 'text-CoolGray' }`}>Monthly</span>
            <span className="bg-MarineBlue flex items-center justify-between w-8 p-1 rounded-xl">
              <span
                className={`${user.plan?.subscription === 'monthly' ? 'bg-White' : 'bg-transparent'} transition-colors h-2.5 w-2.5 md:h-3 md:w-3 rounded-full`}
                onClick={() => setUser({ ...user, plan: {...user.plan, subscription: 'monthly'}})}
              ></span>
              <span
                className={`${user.plan?.subscription === 'yearly' ? 'bg-White' : 'bg-transparent'} transition-colors h-2.5 w-2.5 md:h-3 md:w-3 rounded-full`}
                onClick={() => setUser({ ...user, plan: {...user.plan, subscription: 'yearly'}})}
              ></span>
            </span>
            <span className={`${user.plan?.subscription === 'yearly' ? 'text-MarineBlue' : 'text-CoolGray' }`}>Yearly</span>
          </div>

        </div>
        : active === 2 ?
        <div className="flex flex-col gap-4">
          {/* item */}
          { addOns.map((addOn, i) =>
            <div key={i} className={`flex items-center justify-between border rounded-md ${user.addons.includes(addOn.head) ? 'bg-Magnolia border-PurplishBlue' : 'border-LightGray'} p-3 md:p-4`}>
              <div className="flex items-center gap-4">
                <input type="checkbox" checked={user.addons.includes(addOn.head)}
                  className="bg-PurplishBlue w-4 md:w-5 h-4 md:h-5" onChange={() => handleCheck(addOn.head)} />
                <div className="flex flex-col gap-.5">
                  <span className="text-MarineBlue font-semibold text-xs md:text-md">{addOn.head}</span>
                  <span className="text-xs md:text-sm text-CoolGray">{addOn.liner}</span>
                </div>
              </div>
              <span className="text-PurplishBlue md:text-sm text-xs font-medium">+${user.plan.subscription === 'monthly' ? `${addOn.cost}/mo` : `${addOn.cost * 10}/yr`}</span>
            </div>
          )
          }
          {planErr && user.addons.length === 0 && <span className="text-StrawberryRed text-xs md:text-sm">Please select an add-on</span>}
        </div>
        :
        <div className="flex flex-col gap-4">
          <div className="flex flex-col divide-y gap-4 bg-Magnolia rounded-md p-4">
            <div className="flex justify-between items-center text-sm md:text-md">
              <div className="flex flex-col gap-1">
                <span className="text-MarineBlue font-semibold capitalize">{user.plan.name} ({user.plan.subscription})</span>
                <span className="text-xs md:text-sm text-CoolGray underline cursor-pointer transition-colors hover:text-PurplishBlue"
                  onClick={(e) =>{e.stopPropagation(); setActive(1)}}
                >Change</span>
              </div>
              <span className="text-MarineBlue font-semibold text-xs md:text-sm">${user.plan.name ? (user.plan.subscription === 'monthly' ? `${plans[user.plan.name] / 10}/mo` : `${plans[user.plan.name]}/yr`) : 0}</span>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              { user.addons?.map((addOn, i) =>
                <div key={i} className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-CoolGray">{addOn}</span>
                  <span className="text-MarineBlue font-medium">+${addOns.filter(adOn => adOn.head === addOn)[0].cost}/mo</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-CoolGray">Total ({user.plan.subscription === 'monthly' ? 'per month' : 'per year'})</span>
            <span className="text-sm md:text-lg text-PurplishBlue font-semibold">
              +${user.plan.name ? user.plan.subscription === 'monthly' ? `${plans[user.plan.name] / 10 + addOnsCost}/mo` : `${plans[user.plan.name] + addOnsCost}/yr` : 0}
            </span>
          </div>
        </div>
        }
        {/* Actions */}
        <div className="absolute bottom-4 right-4 w-full z-10 pl-8 md:pl-4 md:relative flex justify-between items-center mt-12 md:text-md text-xs">
            { active > 0 ? <span disabled={active <= 0} className="text-CoolGray font-semibold p-2 pl-0 rounded-md px-4 cursor-pointer
            transition-colors hover:text-MarineBlue"
              onClick={() => active > 0 && setActive(active - 1)}>Go back</span> : <span className=""></span> }
            {active <= 2 ? <span disabled={active > 3} className="bg-MarineBlue text-White p-2 rounded-md px-4 cursor-pointer
              transition-colors hover:bg-PurplishBlue"
                onClick={handleNext}>Next step</span>
              :
              <button disabled={active > 3} className="bg-PurplishBlue text-White p-2 rounded-md px-4 cursor-pointer
                transition-colors hover:bg-LightBlue"
                  onClick={() => {console.log({ user })}}>Confirm</button>
            }
        </div>
        </form>
         <div className="md:hidden absolute bottom-0 w-full flex justify-end items-center p-10 bg-White mt-12">
         </div>
        </>
      :
        <div className="bg-White md:bg-transparent m-4 -mt-16 md:m-0 rounded-md md:rounded-0 flex flex-col items-center
          justify-center gap-4 md:gap-8 p-16 md:min-h-[500px]">
          <span className=""><img src={thanks} alt="" className="h-12 md:h-auto" /></span>
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <span className="text-MarineBlue font-bold text-xl md:text-3xl">Thank you!</span>
            <span className="text-CoolGray text-sm md:text-md">Thanks for confirming your subscription! We hope you have fun using our platform. If you ever need support, please feel free to email us at support@loremgaming.com</span>
          </div>
        </div>
      }
    </div>
   </div>
  )
}

export default App
