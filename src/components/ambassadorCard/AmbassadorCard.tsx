import { forwardRef, useCallback, useEffect, useRef } from "react";
import type { CreateTypes } from "canvas-confetti";
import Confetti from "react-canvas-confetti";

import { calculateAge, formatDate, isBirthday } from "../../utils/dateManager";
import {
  getClassification,
  getAmbassadorImages,
  getIUCNStatus,
  type AmbassadorKey,
  type AmbassadorImage,
  useAmbassador,
} from "../../utils/ambassadors";
import { camelToKebab } from "../../utils/helpers";
import { classes } from "../../utils/classes";

import IconInfo from "../icons/IconInfo";

import Tooltip from "../tooltip/Tooltip";

import moderatorBadge from "../../assets/mod.svg";
import partyHat from "../../assets/party.png";

const headingClass = "text-base text-alveus-green-400";

const offsetPosition = (position: AmbassadorImage["position"]) => {
  const [x, y] = (position || "50% 50%").split(" ");
  return `${x} min(calc(${y} + 1.5rem), 0%)`;
};

export interface AmbassadorCardProps {
  ambassador: AmbassadorKey;
  onClose?: () => void;
  className?: string;
}

export default forwardRef(function AmbassadorCard(
  props: AmbassadorCardProps,
  ref,
) {
  const { ambassador: ambassadorKey, onClose, className, ...extras } = props;
  const ambassador = useAmbassador(ambassadorKey);
  const images = getAmbassadorImages(ambassadorKey);

  const mod =
    window?.Twitch?.ext?.viewer?.role === "broadcaster" ||
    window?.Twitch?.ext?.viewer?.role === "moderator";
  const birthday = ambassador.birth && isBirthday(ambassador.birth);

  const internalRef = useRef<HTMLDivElement>();
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === "function") ref(node);
        else ref.current = node;
      }
      internalRef.current = node ?? undefined;
    },
    [ref],
  );

  const timeout = useRef<NodeJS.Timeout>();
  const confettiInit = useCallback(
    ({ confetti }: { confetti: CreateTypes }) => {
      const node = internalRef.current;
      if (
        !node ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      timeout.current = setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const origin = {
          x: (rect.x + rect.width / 2) / window.innerWidth,
          y: (rect.y + rect.height / 2) / window.innerHeight,
        };

        confetti({
          spread: 26,
          startVelocity: 55,
          origin,
          particleCount: Math.floor(200 * 0.25),
        });
        confetti({
          spread: 60,
          origin,
          particleCount: Math.floor(200 * 0.2),
        });
        confetti({
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          origin,
          particleCount: Math.floor(200 * 0.35),
        });
        confetti({
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          origin,
          particleCount: Math.floor(200 * 0.1),
        });
        confetti({
          spread: 120,
          startVelocity: 45,
          origin,
          particleCount: Math.floor(200 * 0.1),
        });
      }, 500);
    },
    [origin],
  );
  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <>
      {birthday && <Confetti onInit={confettiInit} />}
      <div
        className={classes(
          "bg-alveus-green-900 relative flex max-h-full min-h-[min(28rem,100%)] w-80 max-w-full flex-col justify-start rounded-lg align-top text-xs shadow-xl",
          className,
        )}
        ref={callbackRef}
        {...extras}
      >
        {birthday && (
          <img
            src={partyHat}
            alt=""
            className="absolute left-1/2 top-0 z-10 h-auto w-16 -translate-x-1/2 -translate-y-[85%]"
          />
        )}
        <div className="relative w-full overflow-hidden rounded-t-lg">
          <img
            className="peer aspect-[2.2] w-full object-cover sm:aspect-[1.8]"
            src={images[0].src}
            alt={images[0].alt}
            style={{ objectPosition: offsetPosition(images[0].position) }}
          />

          <div className="peer-hover:backdrop-blur-xs bg-alveus-green-900/50 absolute inset-x-0 top-0 flex h-9 w-full backdrop-blur-sm transition-[opacity,backdrop-filter] peer-hover:opacity-10">
            {props.onClose && (
              <button
                className="hover:text-highlight focus:text-highlight absolute right-1 top-1/2 block w-8 -translate-y-1/2 cursor-pointer text-center text-2xl transition-colors"
                onClick={onClose}
                type="button"
                aria-label="Close"
              >
                &times;
              </button>
            )}

            <h2
              className="w-full shrink-0 self-center overflow-hidden overflow-ellipsis text-nowrap py-1 pl-2 pr-10 text-xl"
              title={ambassador.name}
            >
              {ambassador.name}
            </h2>
          </div>
        </div>

        <div className="scrollbar-thin scrollbar-track-alveus-green-900 scrollbar-thumb-alveus-green mb-2 flex flex-auto flex-col gap-1 overflow-y-auto p-2">
          {mod && (
            <div className="flex items-center gap-2">
              <img
                className="h-6 w-6 object-cover"
                src={moderatorBadge}
                alt="Moderator badge"
              />
              <p>
                Show this card to everyone by using{" "}
                <code>!{ambassador.commands[0]}</code> in chat.
              </p>
            </div>
          )}

          <div>
            <h3 className={headingClass}>Species</h3>
            <p>{ambassador.species}</p>
            <p>
              <i>
                {ambassador.scientific} ({getClassification(ambassador.class)})
              </i>
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 [&>*]:mr-auto">
            <div>
              <h3 className={headingClass}>Sex</h3>
              <p>{ambassador.sex || "Unknown"}</p>
            </div>
            <div>
              <h3 className={headingClass}>Age</h3>
              <p>
                {ambassador.birth ? calculateAge(ambassador.birth) : "Unknown"}
              </p>
            </div>
            <div>
              <h3 className={headingClass}>Birthday</h3>
              <p>
                {ambassador.birth ? formatDate(ambassador.birth) : "Unknown"}
              </p>
            </div>
          </div>

          <div>
            <h3 className={headingClass}>Story</h3>
            <p>{ambassador.story}</p>
          </div>

          <div>
            <h3 className={headingClass}>Conservation Mission</h3>
            <p>{ambassador.mission}</p>
          </div>

          <div>
            <Tooltip
              text="An objective assessment system for classifying the status of plants, animals, and other organisms threatened with extinction."
              maxWidth="18rem"
              fontSize="0.9rem"
            >
              <div className="inline-flex items-center gap-2">
                <h3 className={headingClass}>Conservation Status</h3>
                <IconInfo
                  size={20}
                  className="text-alveus-green-400 outline-highlight rounded-full transition-[outline] hover:outline"
                />
              </div>
            </Tooltip>
            <p>IUCN: {getIUCNStatus(ambassador.iucn.status)}</p>
          </div>

          <div>
            <h3 className={headingClass}>Native To</h3>
            <p>{ambassador.native.text}</p>
          </div>

          <div>
            <h3 className={headingClass}>Arrived at Alveus</h3>
            <p>
              {ambassador.arrival
                ? formatDate(ambassador.arrival, false)
                : "Unknown"}
            </p>
          </div>

          <div className="mt-3 italic">
            <p>
              Learn more about {ambassador.name} on the{" "}
              <a
                href={`https://www.alveussanctuary.org/ambassadors/${camelToKebab(
                  ambassadorKey,
                )}`}
                rel="noreferrer"
                target="_blank"
                className="hover:text-highlight focus:text-highlight text-nowrap underline transition-colors"
              >
                Alveus Sanctuary website
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
});
