# Trazum

[Español](README.md) · [Hackathon pitch](PITCH.md#english) · [Demo and evidence](DEMO.md)

**An Argentine student project exploring how technology could support handwriting movements.** When holding or moving a pencil takes effort, the challenge begins before the first letter. I started Trazum after learning about this difficulty on a visit to my former school, Instituto Social Militar Dr. Dámaso Centeno. [Project story in Spanish](docs/HISTORIA.md)

I'm Lautaro Verón. I started Trazum as a student at age 15. My long-term goal is to explore a robotic glove that could support finger and wrist movements through sensors and actuators. The current work consists of simulations and bench prototypes.

![Bench index finger in extension](media/indice-extension.png)

*Bench index finger in extension, image supplied by the developer.* [Index finger gallery](media/README.md)

## What I built for you to try

I built a simulator with two joints and a virtual stylus. Choose **English**, then **Draw my own stroke** to compare the noisy input with the filtered output. I also included an example loop. Both runs use the same synthetic disturbance. The plot reports RMS and peak error.

The filter uses current and past input samples. I use the reference stroke to generate the input and score each path. [Theory](docs/BASE_TEORICA.md) · [Architecture](docs/ARQUITECTURA.md)

### Run locally

Install Git and **Node.js 22.12 or later** with npm. Installation downloads the dependencies. Running the demo requires no account or paid service.

```sh
git clone https://github.com/fazmarmot-lgtm/Trazum.git
cd Trazum
npm ci
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Run the tests or preview the production build with:

```sh
npm test
npm run build
npm run preview
```

## What I tested

| Evidence | Result | Scope |
| --- | --- | --- |
| Public simulator | 121 reproducible samples. Default RMS error is 0.176 for the input and 0.144 after filtering. | Synthetic case with a known target. |
| Printed index finger | I assembled and flexed a six-piece prototype by hand on a bench. | Qualitative observation of one unit. |
| Digital audits | I checked 192 index configurations and 45 full-hand poses. I found no interferences in those samples. | The reports match the meshes for the audited revisions. |

I still need to integrate sensing and motors and test whether I can estimate hand movement. Next I plan to measure force and travel across repeated bench trials. I also want to find out whether Trazum could help with a handwriting task. **Trazum is an experimental prototype that has not been validated as a medical device.** [Development and results](docs/DESARROLLO.md) · [Limitations](docs/LIMITACIONES.md)

## AI disclosure and demo video

I used ChatGPT/Codex for development and documentation, and Claude and DeepSeek for technical review. The standalone demo uses classical kinematics and exponential smoothing. It has no trained model or AI API dependency. [AI disclosure in Spanish](docs/USO_DE_IA.md)

I’ll add the video link once it’s ready. [Demo outline and evidence](DEMO.md) · [Jury Q&A](PREGUNTAS.md)
