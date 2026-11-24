# Trazum

[Español](README.md) · [Hackathon pitch](PITCH.md#english) · [Demo and evidence](DEMO.md)

**An Argentine student project exploring how technology could support handwriting movements.** When holding or moving a pencil takes effort, the challenge begins before the first letter. I started Trazum after learning about this difficulty on a visit to my former school, Instituto Social Militar Dr. Dámaso Centeno. [Project story in Spanish](docs/HISTORIA.md)

I'm Lautaro Verón. I started Trazum as a student at age 15. My long-term goal is to explore a robotic glove that could support finger and wrist movements through sensors and actuators. The current work consists of simulations and bench prototypes.

![Bench index finger in extension](media/indice-extension.png)

*Bench index finger in extension, image supplied by the developer.* [Index finger gallery](media/README.md)

## What I built for you to try

Choose **English**, then **Start demonstration** to draw a stroke and select **A straight line** or **A smoother curve**. I apply the selected assistance after you finish drawing and show both paths in 2D and 3D. I also included a shaky example stroke. In **Advanced mode** I kept the overlay plot, two-joint mechanism, camera controls, disturbance, and filtering settings.

In advanced mode I can add simulated disturbance and evaluate a filter that uses current and past input samples. [Theory](docs/BASE_TEORICA.md) · [Architecture](docs/ARQUITECTURA.md)

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
| Advanced experiment | 121 reproducible samples. Default RMS error is 0.114 for the input and 0.104 after filtering. | Synthetic case with a known target. |
| Printed index finger | I assembled and flexed a six-piece prototype by hand on a bench. | Qualitative observation of one unit. |
| Digital audits | I checked 192 index configurations and 45 full-hand poses. I found no interferences in those samples. | The reports match the meshes for the audited revisions. |

I still need to integrate sensing and motors and test whether I can estimate hand movement. Next I plan to measure force and travel across repeated bench trials. I also want to find out whether Trazum could help with a handwriting task. **Trazum is an experimental prototype that has not been validated as a medical device.** [Development and results](docs/DESARROLLO.md) · [Limitations](docs/LIMITACIONES.md)

## AI disclosure and demo video

I used ChatGPT/Codex for development and documentation, and Claude and DeepSeek for technical review. The standalone demo uses classical kinematics and exponential smoothing. It has no trained model or AI API dependency. [AI disclosure in Spanish](docs/USO_DE_IA.md)

I’ll add the video link once it’s ready. [Demo outline and evidence](DEMO.md) · [Jury Q&A](PREGUNTAS.md)
