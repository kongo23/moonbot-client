import React from 'react';
import Particles from 'react-particles';
import type { Engine } from 'tsparticles-engine';
import { loadStarsPreset } from 'tsparticles-preset-stars';

// eslint-disable-next-line no-undef
class ParticlesContainer extends React.PureComponent<IProps> {
  // this customizes the component tsParticles installation
  // eslint-disable-next-line class-methods-use-this
  async customInit(engine: Engine): Promise<void> {
    // this adds the preset to tsParticles, you can safely use the
    await loadStarsPreset(engine);
  }

  render() {
    const options = {
      preset: 'stars',
      background: { opacity: 0 },
      smooth: true,
      fpsLimit: 60,
      zLayers: 1,
    };

    return <Particles options={options} init={this.customInit} />;
  }
}

export default ParticlesContainer;
