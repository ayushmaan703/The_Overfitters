// import Spline from '@splinetool/react-spline';

// export default function Home() {
//   return (
//     <main>
//       <Spline
//         scene="https://prod.spline.design/ElzOYn0JskGickIe/scene.splinecode" 
//       />
//     </main>
//   );
// }
import Spline from '@splinetool/react-spline';

export default function Home({ children }) {
    return (
        <main className="relative w-[5vh] h-[5vh] overflow-hidden">

            {/* Background Spline */}
            <div className="absolute  inset-3 left-0 flex items-center justify-center -z-10">
                <div className="w-[50%] h-[50%] opacity-40 blur-sm">
                    {/* <div className="absolute bottom-0 right-0 w-[350px] h-[350px] -z-10 opacity-60"> */}
                    <Spline scene="https://prod.spline.design/ElzOYn0JskGickIe/scene.splinecode" />
                </div>
            </div>
            {/* Foreground Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
                {/* <h1 className="text-white text-4xl font-bold">
          Your Content Here
        </h1> */}
                {children}
            </div>

        </main>
    );
}