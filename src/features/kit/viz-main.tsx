import { render } from 'preact';
import '../../styles/fonts.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/viz.css';
import '../../styles/figure.css';
import { KitViz } from './viz.tsx';

render(<KitViz />, document.getElementById('app') as HTMLElement);
