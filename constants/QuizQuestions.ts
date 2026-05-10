export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number; // index of correct answer
}

// 10 questions per skill for variety
const Q: Record<string, QuizQuestion[]> = {
  labour: [
    { id:'l1', question:'What is the primary purpose of a safety helmet on a construction site?', options:['Sun protection','Head injury protection','Rain protection','Fashion'], correct:1 },
    { id:'l2', question:'Which tool is used for digging trenches?', options:['Hammer','Spade/Shovel','Screwdriver','Wrench'], correct:1 },
    { id:'l3', question:'What does PPE stand for?', options:['Personal Protective Equipment','Public Project Equipment','Private Power Engine','Professional Plan Execution'], correct:0 },
    { id:'l4', question:'How should heavy materials be lifted safely?', options:['Bend your back','Use your legs, keep back straight','Twist while lifting','Lift quickly'], correct:1 },
    { id:'l5', question:'What is a wheelbarrow used for?', options:['Cutting wood','Transporting materials','Measuring length','Welding metal'], correct:1 },
    { id:'l6', question:'Which signal means "Stop" on a construction site?', options:['Green flag','Whistle blow','Raised closed fist','Waving both hands'], correct:2 },
    { id:'l7', question:'What is the purpose of scaffolding?', options:['Decoration','Temporary elevated platform for workers','Permanent wall support','Water drainage'], correct:1 },
    { id:'l8', question:'What should you do before starting work at a new site?', options:['Start immediately','Attend safety briefing','Take a selfie','Call your friend'], correct:1 },
    { id:'l9', question:'What is cement mixed with to make concrete?', options:['Only water','Sand, gravel and water','Oil and paint','Mud only'], correct:1 },
    { id:'l10', question:'When is it unsafe to work at height?', options:['Morning time','During strong winds/rain','After lunch','On weekdays'], correct:1 },
  ],
  mason: [
    { id:'m1', question:'What is the standard ratio of cement to sand for brick mortar?', options:['1:1','1:4 to 1:6','1:10','2:1'], correct:1 },
    { id:'m2', question:'What tool is used to check if a wall is vertical?', options:['Spirit level / Plumb bob','Hammer','Trowel','Chisel'], correct:0 },
    { id:'m3', question:'How long should bricks be soaked in water before use?', options:['No soaking needed','30 minutes','12-24 hours','1 week'], correct:2 },
    { id:'m4', question:'What is pointing in masonry?', options:['Finishing mortar joints on wall face','Making holes','Breaking bricks','Painting walls'], correct:0 },
    { id:'m5', question:'Which bond has bricks laid lengthwise in every course?', options:['English bond','Flemish bond','Stretcher bond','Header bond'], correct:2 },
    { id:'m6', question:'What is the purpose of curing concrete?', options:['Making it look shiny','Maintaining moisture for strength','Drying it faster','Adding color'], correct:1 },
    { id:'m7', question:'What is plastering?', options:['Painting walls','Applying cement-sand coat on walls','Breaking walls','Installing tiles'], correct:1 },
    { id:'m8', question:'What is the standard thickness of a single brick wall?', options:['3 inches','4.5 inches (half brick)','12 inches','1 inch'], correct:1 },
    { id:'m9', question:'Which material is used for waterproofing?', options:['Normal cement','Bitumen/waterproof compound','Sand only','Chalk powder'], correct:1 },
    { id:'m10', question:'What is a lintel in construction?', options:['A floor tile','Horizontal beam over door/window opening','A type of brick','Roof material'], correct:1 },
  ],
  electrician: [
    { id:'e1', question:'What is the unit of electrical resistance?', options:['Volt','Ampere','Ohm','Watt'], correct:2 },
    { id:'e2', question:'Which wire color is typically used for earth/ground in India?', options:['Red','Black','Green','Blue'], correct:2 },
    { id:'e3', question:'What device protects against electrical overload?', options:['Switch','MCB/Fuse','Plug','Socket'], correct:1 },
    { id:'e4', question:'What is the standard household voltage in India?', options:['110V','220-240V','440V','12V'], correct:1 },
    { id:'e5', question:'Which tool is used to check if a wire is live?', options:['Hammer','Tester/Neon screwdriver','Pliers','Tape'], correct:1 },
    { id:'e6', question:'What does AC stand for?', options:['Air Conditioning only','Alternating Current','Automatic Circuit','Active Cable'], correct:1 },
    { id:'e7', question:'What should you do before working on any electrical circuit?', options:['Wear gloves only','Switch off the main supply','Inform neighbors','Nothing special'], correct:1 },
    { id:'e8', question:'What is the function of an ELCB/RCCB?', options:['Increase voltage','Protect against earth leakage/shock','Reduce electricity bill','Store electricity'], correct:1 },
    { id:'e9', question:'Which material is a good insulator?', options:['Copper','Iron','Rubber','Aluminum'], correct:2 },
    { id:'e10', question:'What happens when you connect too many devices to one socket?', options:['Nothing','Overloading and fire risk','Devices work faster','Electricity bill decreases'], correct:1 },
  ],
  carpenter: [
    { id:'c1', question:'Which wood joint is strongest for furniture corners?', options:['Butt joint','Mortise and tenon','Nail joint','Tape joint'], correct:1 },
    { id:'c2', question:'What tool is used to smoothen wood surfaces?', options:['Saw','Planer/Sandpaper','Drill','Hammer'], correct:1 },
    { id:'c3', question:'What is plywood made of?', options:['Single thick wood','Thin wood layers glued together','Plastic','Cement'], correct:1 },
    { id:'c4', question:'Which tool is used to measure angles in woodwork?', options:['Tape measure','Try square/protractor','Chisel','Screwdriver'], correct:1 },
    { id:'c5', question:'What is seasoning of wood?', options:['Adding flavor','Drying wood to reduce moisture','Painting wood','Cutting wood'], correct:1 },
    { id:'c6', question:'What is MDF?', options:['Metal Door Frame','Medium Density Fiberboard','Main Design Feature','Mixed Dry Finish'], correct:1 },
    { id:'c7', question:'Which saw is used for curved cuts?', options:['Hand saw','Jigsaw/Coping saw','Circular saw','Hack saw'], correct:1 },
    { id:'c8', question:'What causes wood to warp?', options:['Proper drying','Uneven moisture content','Good quality','Correct storage'], correct:1 },
    { id:'c9', question:'What is veneer?', options:['Thick wood plank','Thin decorative wood sheet','Type of nail','Wood paint'], correct:1 },
    { id:'c10', question:'What adhesive is commonly used in woodwork?', options:['Cement','Fevicol/Wood glue','Water','Oil'], correct:1 },
  ],
  painter: [
    { id:'p1', question:'What is primer used for before painting?', options:['Final coat decoration','Base coat for better paint adhesion','Removing old paint','Waterproofing'], correct:1 },
    { id:'p2', question:'How many coats of paint are typically needed?', options:['1','2-3','5-6','10'], correct:1 },
    { id:'p3', question:'What is putty used for in wall painting?', options:['Adding color','Filling cracks and smoothing surface','Waterproofing','Removing old paint'], correct:1 },
    { id:'p4', question:'Which tool gives the smoothest paint finish?', options:['Brush','Roller','Spray gun','Cloth'], correct:2 },
    { id:'p5', question:'What is POP in interior work?', options:['Point of Purchase','Plaster of Paris','Paint Over Primer','Professional Outer Paint'], correct:1 },
    { id:'p6', question:'What should be done before repainting old walls?', options:['Paint directly','Clean, scrape loose paint, apply primer','Add water to wall','Nothing'], correct:1 },
    { id:'p7', question:'What is texture painting?', options:['Normal flat painting','Creating patterns/3D effects on walls','Painting textures only','Exterior painting'], correct:1 },
    { id:'p8', question:'Which type of paint is water-resistant?', options:['Distemper','Enamel/Emulsion waterproof','Whitewash','Chalk paint'], correct:1 },
    { id:'p9', question:'What is the drying time between paint coats?', options:['No wait needed','4-6 hours minimum','1 minute','1 week'], correct:1 },
    { id:'p10', question:'What causes paint to peel off?', options:['Good primer','Moisture/poor surface preparation','Expensive paint','Bright colors'], correct:1 },
  ],
  plumber: [
    { id:'pl1', question:'What is the standard pipe size for household water supply?', options:['1/4 inch','1/2 to 3/4 inch','3 inches','6 inches'], correct:1 },
    { id:'pl2', question:'What material are modern water pipes usually made of?', options:['Wood','CPVC/PVC plastic','Paper','Glass'], correct:1 },
    { id:'pl3', question:'What tool is used to cut pipes?', options:['Hammer','Pipe cutter/Hacksaw','Screwdriver','Plumb bob'], correct:1 },
    { id:'pl4', question:'What is a P-trap in plumbing?', options:['A pump','Curved pipe preventing sewer gas entry','A pipe joint','Water meter'], correct:1 },
    { id:'pl5', question:'What causes low water pressure?', options:['New pipes','Blockage/leakage in pipes','Clean water','Large tank'], correct:1 },
    { id:'pl6', question:'What is Teflon tape used for?', options:['Decoration','Sealing threaded pipe joints','Insulation','Measuring'], correct:1 },
    { id:'pl7', question:'What is the slope needed for drainage pipes?', options:['No slope','1/4 inch per foot downward','Upward slope','Random'], correct:1 },
    { id:'pl8', question:'Which valve completely stops water flow?', options:['Check valve','Gate/Ball valve','Air valve','Pressure valve'], correct:1 },
    { id:'pl9', question:'What is solvent cement used for?', options:['Wall painting','Joining PVC pipes','Metal welding','Wood gluing'], correct:1 },
    { id:'pl10', question:'How do you detect a hidden water leak?', options:['Ignore it','Check water meter, look for damp spots','Add more water','Paint over it'], correct:1 },
  ],
  welder: [
    { id:'w1', question:'What does MIG welding stand for?', options:['Metal Inert Gas','Machine Iron Grip','Manual Impact Gun','Mixed Industrial Grade'], correct:0 },
    { id:'w2', question:'What protective gear is essential for welding?', options:['Sunglasses','Welding helmet with dark lens','Normal glasses','Hat'], correct:1 },
    { id:'w3', question:'What gas is commonly used in MIG welding?', options:['Oxygen','Argon/CO2','Nitrogen','Hydrogen'], correct:1 },
    { id:'w4', question:'What causes porosity in a weld?', options:['Slow welding','Gas/moisture contamination','Clean metal','Proper technique'], correct:1 },
    { id:'w5', question:'What is flux in welding?', options:['Electricity flow','Material that shields weld from oxidation','A type of metal','Welding speed'], correct:1 },
    { id:'w6', question:'What is the purpose of grinding after welding?', options:['Making noise','Smoothing and finishing the weld joint','Weakening the joint','Adding material'], correct:1 },
    { id:'w7', question:'Which type of welding uses a consumable electrode?', options:['TIG','MIG/Arc welding','Gas cutting','Soldering'], correct:1 },
    { id:'w8', question:'What is tack welding?', options:['Final welding','Small temporary welds to hold pieces in position','Decorative welding','Underwater welding'], correct:1 },
    { id:'w9', question:'What metal cannot be easily welded with normal methods?', options:['Mild steel','Cast iron/Aluminum (needs special process)','Iron rods','Steel plates'], correct:1 },
    { id:'w10', question:'What is the minimum safe distance from welding for bystanders?', options:['1 foot','10-15 feet','100 feet','No limit'], correct:1 },
  ],
  it_technician: [
    { id:'t1', question:'What does ITI stand for?', options:['Indian Technical Institute','Industrial Training Institute','International Tech Inc','Info Tech India'], correct:1 },
    { id:'t2', question:'What is a multimeter used for?', options:['Cutting wires','Measuring voltage, current, resistance','Welding','Painting'], correct:1 },
    { id:'t3', question:'What is CNC in manufacturing?', options:['Central Network Computer','Computer Numerical Control','Cable Network Connection','Certified National Certificate'], correct:1 },
    { id:'t4', question:'What is the function of a capacitor?', options:['Cut wires','Store and release electrical energy','Generate heat','Produce sound'], correct:1 },
    { id:'t5', question:'What does LED stand for?', options:['Light Emitting Diode','Low Energy Device','Long Electric Distance','Laser Energy Display'], correct:0 },
    { id:'t6', question:'What is soldering used for?', options:['Cutting metal','Joining electronic components','Painting circuits','Measuring resistance'], correct:1 },
    { id:'t7', question:'What is a PCB?', options:['Personal Computer Box','Printed Circuit Board','Power Control Button','Plastic Cable Band'], correct:1 },
    { id:'t8', question:'Which tool is used to strip wire insulation?', options:['Hammer','Wire stripper','Screwdriver','Pliers only'], correct:1 },
    { id:'t9', question:'What is an oscilloscope used for?', options:['Measuring weight','Viewing electrical signal waveforms','Cutting circuits','Printing labels'], correct:1 },
    { id:'t10', question:'What safety precaution is needed when working with electronics?', options:['Wear wooden shoes','Use ESD wrist strap/ground yourself','Work in rain','Touch all components'], correct:1 },
  ],
  foreman: [
    { id:'f1', question:'What is the primary role of a foreman?', options:['Only physical work','Supervising workers and managing site activities','Accounting','Marketing'], correct:1 },
    { id:'f2', question:'What is a Gantt chart used for?', options:['Drawing building plans','Project scheduling and timeline tracking','Measuring materials','Safety records'], correct:1 },
    { id:'f3', question:'How should a foreman handle a safety violation?', options:['Ignore it','Stop work, correct immediately, report','Join in','Wait for accident'], correct:1 },
    { id:'f4', question:'What is BOQ in construction?', options:['Box of Quality','Bill of Quantities','Board of Questions','Batch of Quotations'], correct:1 },
    { id:'f5', question:'What should a daily site report include?', options:['Only weather','Work done, workers present, materials used, issues','Personal diary','Food menu'], correct:1 },
    { id:'f6', question:'What is the purpose of a toolbox talk?', options:['Selling tools','Brief safety discussion before work starts','Tool inventory','Break time'], correct:1 },
    { id:'f7', question:'How do you estimate material for a task?', options:['Guess randomly','Calculate from drawings/measurements','Ask neighbors','Use last project data only'], correct:1 },
    { id:'f8', question:'What is RCC in construction?', options:['Random Cement Compound','Reinforced Cement Concrete','Regular Construction Code','Rapid Curing Cement'], correct:1 },
    { id:'f9', question:'What action when a worker is injured on site?', options:['Continue work','First aid, report, arrange medical help','Hide the incident','Send worker home'], correct:1 },
    { id:'f10', question:'What is quality control on a construction site?', options:['Painting nicely','Ensuring work meets standards and specifications','Working fast','Using expensive materials'], correct:1 },
  ],
  supervisor: [
    { id:'s1', question:'What is the key skill needed for a supervisor?', options:['Only physical strength','Leadership and communication','Cooking','Singing'], correct:1 },
    { id:'s2', question:'How should work schedules be planned?', options:['Randomly','Based on project timeline, resources, priorities','By worker preference only','No planning needed'], correct:1 },
    { id:'s3', question:'What is inventory management?', options:['Ignoring stock','Tracking materials received, used, and remaining','Throwing away extras','Ordering everything'], correct:1 },
    { id:'s4', question:'How do you handle a dispute between workers?', options:['Ignore it','Listen to both sides, mediate fairly','Take one side','Fire both'], correct:1 },
    { id:'s5', question:'What is a work permit system?', options:['Travel document','Written authorization for hazardous tasks','Attendance register','Payment slip'], correct:1 },
    { id:'s6', question:'What does FIFO mean in inventory?', options:['Fast In Fast Out','First In First Out','Final Inspection For Output','Free Items For Office'], correct:1 },
    { id:'s7', question:'What is the purpose of a site inspection?', options:['Taking photos','Checking quality, safety, and progress','Socializing','Rest break'], correct:1 },
    { id:'s8', question:'How should you document incidents?', options:['Verbally only','Written report with date, time, details, witnesses','No documentation','Social media post'], correct:1 },
    { id:'s9', question:'What is productivity in work context?', options:['Working long hours','Output achieved per unit of input/time','Being busy','Talking to boss'], correct:1 },
    { id:'s10', question:'What makes an effective team meeting?', options:['Long and random','Clear agenda, brief, actionable outcomes','No meetings needed','Only complaints'], correct:1 },
  ],
  engineer: [
    { id:'en1', question:'What is the compressive strength of M20 grade concrete?', options:['10 N/mm²','20 N/mm²','30 N/mm²','40 N/mm²'], correct:1 },
    { id:'en2', question:'What is the minimum cover for RCC beams?', options:['10mm','25mm','50mm','100mm'], correct:1 },
    { id:'en3', question:'What does DPC stand for?', options:['Direct Power Connection','Damp Proof Course','Double Pipe Connection','Design Plan Certificate'], correct:1 },
    { id:'en4', question:'What is the standard curing period for concrete?', options:['1 day','7-28 days','3 months','1 year'], correct:1 },
    { id:'en5', question:'What is a load-bearing wall?', options:['Decorative wall','Wall that supports structural weight above','Partition wall','Glass wall'], correct:1 },
    { id:'en6', question:'What instrument measures land elevation?', options:['Thermometer','Theodolite/Auto level','Compass','Calculator'], correct:1 },
    { id:'en7', question:'What is the water-cement ratio for M20 concrete?', options:['0.30','0.45-0.50','0.80','1.0'], correct:1 },
    { id:'en8', question:'What causes cracks in concrete?', options:['Good curing','Excess water, poor curing, overloading','Using steel','Proper mixing'], correct:1 },
    { id:'en9', question:'What is a cantilever beam?', options:['Beam supported at both ends','Beam fixed at one end, free at other','Curved beam','Underground beam'], correct:1 },
    { id:'en10', question:'What is soil bearing capacity?', options:['Soil color','Maximum load soil can support per unit area','Soil temperature','Soil moisture'], correct:1 },
  ],
};

// Shuffle array using Fisher-Yates
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuizQuestions(skillIds: string[], questionsPerSkill: number = 3): { skill: string; questions: QuizQuestion[] }[] {
  return skillIds.map(skill => {
    const pool = Q[skill] || [];
    const shuffled = shuffle(pool);
    const count = skillIds.length === 1 ? 5 : questionsPerSkill;
    return { skill, questions: shuffled.slice(0, Math.min(count, shuffled.length)) };
  });
}
